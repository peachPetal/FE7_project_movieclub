import axios from "axios";

const key = import.meta.env.VITE_TMDB_V4_ACCESS_TOKEN;

export const tmdb = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  headers: {
    Authorization: `Bearer ${key}`,
    accept: "application/json",
  },
});
