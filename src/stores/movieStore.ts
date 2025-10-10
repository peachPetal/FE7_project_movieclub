import { create } from "zustand";

interface MovieState {
  movies: Movie[];
  isLoading: boolean;
  fetchMovies: (limit?: number) => Promise<void>;
}

const MOCK_MOVIES: Movie[] = [
  {
    id: 1,
    title: "얼굴",
    posterUrl:
      "https://i.namu.wiki/i/KMUqfF9AtnJv69CFHKYjteoM3soZ4R3LMeIg1NdH5t-WtdqkfkEAGlU8iLstbrLG16oBcOR5Bdyg8yi3E55EDQ.webp",
    likeCount: 1352,
    commentCount: 214,
  },
  {
    id: 2,
    title: "극장판 귀멸의 칼날: 무한성 편",
    posterUrl:
      "https://i.namu.wiki/i/gwqbq98J0nv5hKDlCnnlu7KJ_zFDzvN9Cj8y5ss64uohGgY_3A5HzFKnxlCNWbxRfIepjW1aAr5q7Zf-QA5lYg.webp",
    likeCount: 1120,
    commentCount: 188,
  },
  {
    id: 3,
    title: "살인자 리포트",
    posterUrl:
      "https://i.namu.wiki/i/jTX-_f2sko_ixODrk94ndy0No4kKvC2jZQMoe1CPHpFQED2YdEGcbseKVmKExzGwO9OfEooygPXTn6aq_lTenA.webp",
    likeCount: 980,
    commentCount: 152,
  },
  {
    id: 4,
    title: "F1 더 무비",
    posterUrl:
      "https://upload.wikimedia.org/wikipedia/ko/thumb/9/93/F1_%EB%8D%94_%EB%AC%B4%EB%B9%84_%ED%8F%AC%EC%8A%A4%ED%84%B0.jpg/250px-F1_%EB%8D%94_%EB%AC%B4%EB%B9%84_%ED%8F%AC%EC%8A%A4%ED%84%B0.jpg",
    likeCount: 850,
    commentCount: 121,
  },
  {
    id: 5,
    title: "홈캠",
    posterUrl:
      "https://i.namu.wiki/i/C4fiPlpmUh5pg8eZ6zyUmutFXMniQt2AZC9xfx5BiASuyokH4ybkowY_tZIqWehBfhENGe6XwY9vp1YQ_Nu2UA.webp",
    likeCount: 760,
    commentCount: 99,
  },
];

export const useMovieStore = create<MovieState>((set) => ({
  movies: [],
  isLoading: false,
  async fetchMovies(limit) {
    // mock API 호출
    set({ isLoading: true });

    await new Promise((r) => setTimeout(r, 300)); // Mock 지연
    const data = limit ? MOCK_MOVIES.slice(0, limit) : MOCK_MOVIES; // limit에 따라 자르기, 우선 mock 데이터 사용
    set({ movies: data, isLoading: false });

    // 실제 API 호출
    //   try {
    //     const res = await fetch(`http://서버주소/movies?limit=${limit}`);
    //     const data = await res.json();
    //     set({ movies: data, isLoading: false });
    //   } catch (err) {
    //     set({ isLoading: false });
    //     console.error(err);
    //   }
  },
}));
