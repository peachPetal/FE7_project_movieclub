import { supabase } from "../utils/supabase";
import { tmdb } from "./tmdb";

export const getMovies = async () => {
  const movieIdRes = await tmdb.get("/discover/movie", {
    params: {
      region: "KR",
      language: "ko-KR",
      with_release_type: "3|2",
      sort_by: "primary_release_date.desc",
      "vote_average.gte": "7",
      "vote_count.gte": "1000",
    },
  });

  const movieIds = movieIdRes.data.results.map((v: { id: any }) => v.id);

  const moviesArray: Movie[] = await Promise.all(
    movieIds.map(async (id: number) => {
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

      return {
        id: id,
        title: title,
        original_title: original_title,
        overview: overview,
        cerfication: cerfication,
        year: release_date.slice(0, 4),
        runtime: runtime,
        genres: genres,
        country: origin_country[0],
        rating: vote_average.toFixed(1),
        poster: `${imgPath}${poster_path}`,
        backdrop: `${imgPath}${backdrop_path}`,
        director: credits.director,
        actors: credits.actors,
        trailer: trailer,
      };
    })
  );

  return moviesArray;
};

const getCredits = async (id: string) => {
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
      params: {
        region: "KR",
        language: "ko-KR",
      },
    })
    .then((res) => {
      const cast = res.data.cast.slice(0, 5);
      const crew = res.data.crew;
      const director = crew.find(
        ({ job }: { job: string }) => job === "Director"
      );

      result.director = director.name;
      result.actors = cast;
    })
    .catch((err) => console.error(`tmdbGetCredits: ${err}`));

  return result;
};

const getTrailer = async (id: string) => {
  let url = "";

  await tmdb
    .get(`/movie/${id}/videos`, {
      params: {
        region: "KR",
        language: "ko-KR",
      },
    })
    .then((res) => {
      const data = res.data.results;
      if (data.length > 0) {
        const videoKey = res.data.results.find(
          (v: { type: string; site: string }) =>
            v.type === "Trailer" && v.site === "YouTube"
        ).key;
        url = `https://www.youtube.com/watch?v=${videoKey}`;
      }
    })
    .catch((err) => console.error(`tmdbGetTrailer: ${err}`));

  return url;
};
