import axios from "axios";

const key = import.meta.env.VITE_TMDB_V4_ACCESS_TOKEN;
export const keyForSearch= import.meta.env.VITE_TMDB_V3_KEY;
export const baseURL = "https://api.themoviedb.org/3";

export const tmdb = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  headers: {
    Authorization: `Bearer ${key}`,
    accept: "application/json",
  },
});
