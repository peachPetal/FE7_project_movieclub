import axios from "axios";
import { keyForSearch, baseURL } from "./tmdb";

/**
 * 🎬 메인 함수: 검색어로 영화를 찾아 상세 정보가 담긴 목록을 반환합니다.
 * (별도의 API 응답 타입을 선언하지 않은 버전)
 * @param query - 검색할 영화 제목
 * @returns {Promise<Movie[]>} - 상세 정보가 모두 채워진 영화 목록
 */
export const tmdbSearch = async (query: string): Promise<Movie[]> => {
  try {
    // 1단계: v3 API 키를 사용하여 영화 ID 목록을 검색합니다.
    const searchResponse = await axios.get(`${baseURL}/search/movie`, {
      params: {
        api_key: keyForSearch, // v3 키는 반드시 파라미터로 전달해야 합니다.
        query,
        language: 'ko-KR',
      },
    });

    // 인라인 타입을 사용하여 응답 데이터의 형태를 명시합니다.
    const movieIds = searchResponse.data.results.map((movie: { id: number }) => movie.id);

    if (!movieIds || movieIds.length === 0) {
      return []; // 검색 결과가 없으면 빈 배열을 반환합니다.
    }

    // 2단계: 각 영화 ID에 대해 상세 정보를 병렬로 가져옵니다.
    const detailPromises = movieIds.map(async (id: number) => {
      try {
        // ✨ append_to_response를 사용해 단 한 번의 호출로 모든 정보를 가져옵니다.
        const movieDetailsRes = await axios.get(`${baseURL}/movie/${id}`, {
          params: {
            api_key: keyForSearch, // 상세 정보 조회에도 v3 키를 사용할 수 있습니다.
            language: 'ko-KR',
            append_to_response: 'credits,videos,release_dates',
          },
        });
        
        // TypeScript가 추론한 'any' 타입의 응답 데이터를 직접 사용합니다.
        const tmdbMovie = movieDetailsRes.data;

        // 3단계: 추론된 데이터를 기반으로 전역 'Movie' 타입 객체를 직접 생성합니다.
        const director = tmdbMovie.credits?.crew.find((p: any) => p.job === 'Director')?.name || '정보 없음';
        const actors: Actor[] = tmdbMovie.credits?.cast.slice(0, 5).map((p: any) => ({
          name: p.name,
          photo: p.profile_path ? `https://image.tmdb.org/t/p/w200${p.profile_path}` : '',
          character: p.character,
        })) || [];
        const trailer = tmdbMovie.videos?.results.find((v: any) => v.site === 'YouTube' && v.type === 'Trailer')?.key || '';
        const krRelease = tmdbMovie.release_dates?.results.find((r: any) => r.iso_3166_1 === 'KR');
        const cerfication = krRelease?.release_dates[0]?.certification || '정보 없음';

        // 전역 'Movie' 타입에 맞게 모든 속성을 채워줍니다.
        const finalMovie: Movie = {
          id: tmdbMovie.id,
          genres: tmdbMovie.genres || [],
          title: tmdbMovie.title,
          original_title: tmdbMovie.original_title,
          overview: tmdbMovie.overview,
          poster: tmdbMovie.poster_path ? `https://image.tmdb.org/t/p/w500${tmdbMovie.poster_path}` : '',
          backdrop: tmdbMovie.backdrop_path ? `https://image.tmdb.org/t/p/w1280${tmdbMovie.backdrop_path}` : '',
          year: tmdbMovie.release_date ? new Date(tmdbMovie.release_date).getFullYear().toString() : '정보 없음',
          runtime: tmdbMovie.runtime || 0,
          country: tmdbMovie.production_countries?.length > 0 ? tmdbMovie.production_countries[0].name : '정보 없음',
          rating: parseFloat(tmdbMovie.vote_average.toFixed(1)) || 0,
          cerfication,
          director,
          actors,
          trailer,
        };
        return finalMovie;

      } catch (detailError) {
        console.warn(`[TMDB] Movie ID ${id}의 상세 정보 로드 실패:`, detailError);
        return null; // 개별 호출 실패 시 null 반환
      }
    });

    const finalMovies = await Promise.all(detailPromises);
    
    // 최종적으로 null이 아닌 유효한 영화 데이터만 필터링하여 반환합니다.
    return finalMovies.filter((movie): movie is Movie => movie !== null);

  } catch (error) {
    console.error("[TMDB] tmdbSearch 함수 에러:", error);
    return []; // 전체 로직 실패 시 빈 배열 반환
  }
};