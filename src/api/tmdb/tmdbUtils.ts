import axios from "axios";
import { supabase } from "../../utils/supabase";
import { tmdb } from "./tmdb";

export type MoviesQuery = {
  page?: number;
  sortBy?: string; // e.g. 'popularity.desc', 'primary_release_date.desc'
  withGenres?: string; // '28,12' (id) or 'Action,Comedy' (name) 허용
  primaryReleaseYear?: number; // 2024
  voteAverageGte?: number; // 평점 하한
  voteCountGte?: number; // 표본수 하한
};

// ---------------- TMDB GENRES (cache) ----------------
let __genreCache: {
  language: string;
  list: { id: number; name: string }[];
} | null = null;

/** 장르 목록 가져오기 (언어별 캐시) */
export const getMovieGenres = async (language: string = "ko-KR") => {
  if (__genreCache && __genreCache.language === language)
    return __genreCache.list;
  const res = await tmdb.get("/genre/movie/list", { params: { language } });
  const list = (res.data?.genres ?? []) as { id: number; name: string }[];
  __genreCache = { language, list };
  return list;
};

/** 장르 “이름 or ID” → ID로 정규화 */
export const resolveGenreId = async (
  genre: number | string | undefined,
  language: string = "ko-KR"
): Promise<number | undefined> => {
  if (genre == null) return undefined;
  if (typeof genre === "number") return genre;
  const list = await getMovieGenres(language);
  const found = list.find(
    (g) => g.name.toLowerCase() === String(genre).toLowerCase()
  );
  return found?.id;
};
// -----------------------------------------------------

export const getMovies = async (page: number = 1) => {
  const movieIdRes = await tmdb.get("/discover/movie", {
    params: {
      region: "KR",
      language: "ko-KR",
      with_release_type: "3|2",
      sort_by: "primary_release_date.desc",
      "vote_average.gte": "7",
      "vote_count.gte": "1000",
      page,
    },
  });

  const movieIds = movieIdRes.data.results.map((v: { id: number }) => v.id);
  const moviesArray: (Movie | null)[] = await Promise.all(
    movieIds.map(async (id: number) => getMovieById(id))
  );
  return moviesArray.filter(Boolean) as Movie[];
};

export const getMovieById = async (id: number) => {
  try {
    const MovieRes = await tmdb.get(`/movie/${id}`, {
      params: { region: "KR", language: "ko-KR" },
    });

    const {
      id: movieId,
      title,
      genres,
      origin_country,
      original_title,
      overview,
      backdrop_path,
      poster_path,
      release_date,
      runtime,
      vote_average,
    } = MovieRes.data;

    const imgPath = `https://image.tmdb.org/t/p/original`;

    const certificationData = await tmdb
      .get(`/movie/${id}/release_dates`, {
        params: { region: "KR", language: "ko-KR" },
      })
      .then((v) =>
        v.data.results.find(
          ({ iso_3166_1 }: { iso_3166_1: string }) => iso_3166_1 === "KR"
        )
      );

    const cerfication = certificationData
      ? certificationData["release_dates"][0]["certification"]
      : "";

    const credits = await getCredits(movieId);
    const trailer = await getTrailer(movieId);
    const reviews = await getReviews(String(movieId)); // 안전

    return {
      id,
      title,
      original_title,
      overview,
      cerfication,
      year: release_date?.slice(0, 4),
      runtime,
      genres,
      country: origin_country?.[0],
      rating: vote_average?.toFixed?.(1),
      poster: poster_path ? `${imgPath}${poster_path}` : "",
      backdrop: backdrop_path ? `${imgPath}${backdrop_path}` : "",
      director: credits.director,
      actors: credits.actors,
      trailer,
      reviews: reviews ?? [],
    };
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status === 404) {
      return null;
    }
    throw err;
  }
};

const getCredits = async (id: number) => {
  const result: { director: string; actors: Actor[] } = {
    director: "",
    actors: [
      {
        adult: false,
        gender: 1,
        id: 0,
        known_for_department: "",
        name: "",
        original_name: "",
        popularity: 0,
        profile_path: "",
        cast_id: 0,
        character: "",
        credit_id: "",
        order: 0,
      },
    ],
  };

  await tmdb
    .get(`/movie/${id}/credits`, {
      params: { region: "KR", language: "ko-KR" },
    })
    .then((res) => {
      const cast = res.data.cast?.slice(0, 5) ?? [];
      const crew = res.data.crew ?? [];
      const director = crew.find(
        ({ job }: { job: string }) => job === "Director"
      );
      result.director = director?.name ?? "";
      result.actors = cast;
    })
    .catch((err) => console.error(`tmdbGetCredits: ${err}`));

  return result;
};

const getTrailer = async (id: number) => {
  let url = "";

  await tmdb
    .get(`/movie/${id}/videos`, {
      params: { region: "KR", language: "ko-KR" },
    })
    .then((res) => {
      const data = res.data.results ?? [];
      if (data.length > 0) {
        const video = data.find(
          (v: { type: string; site: string }) =>
            v.type === "Trailer" && v.site === "YouTube"
        );
        if (video?.key) url = `https://www.youtube.com/watch?v=${video.key}`;
      }
    })
    .catch((err) => console.error(`tmdbGetTrailer: ${err}`));

  return url;
};

export const getReviews = async (id: string) => {
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("movie_id", id)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};

export const getMoviesWithFilters = async (query: MoviesQuery = {}) => {
  const {
    page = 1,
    sortBy = "primary_release_date.desc",
    withGenres,
    primaryReleaseYear,
    voteAverageGte = 7,
    voteCountGte = 1000,
  } = query;

  // 장르 정규화 (이름/ID, 콤마 다중 허용)
  let withGenresParam: string | undefined = undefined;
  if (withGenres) {
    const tokens = String(withGenres)
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const resolved: number[] = [];
    for (const tk of tokens) {
      const maybeNum = Number(tk);
      if (!Number.isNaN(maybeNum)) {
        resolved.push(maybeNum);
      } else {
        const id = await resolveGenreId(tk); // 이름 → ID
        if (id) resolved.push(id);
      }
    }
    withGenresParam = resolved.length ? resolved.join(",") : undefined;
  }

  const params: Record<string, string | number> = {
    region: "KR",
    language: "ko-KR",
    with_release_type: "3|2",
    sort_by: sortBy,
    "vote_average.gte": String(voteAverageGte),
    "vote_count.gte": String(voteCountGte),
    page,
  };
  if (withGenresParam) params.with_genres = withGenresParam;
  if (primaryReleaseYear) params.primary_release_year = primaryReleaseYear;

  const res = await tmdb.get("/discover/movie", { params });

  const movieIds = res.data.results?.map((v: { id: number }) => v.id) ?? [];
  const items = (
    await Promise.all(movieIds.map((id: number) => getMovieById(id)))
  ).filter(Boolean) as Movie[];

  return items;
};
