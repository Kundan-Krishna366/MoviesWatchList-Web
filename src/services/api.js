const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

const requestTmdb = async (path, params = {}, signal) => {
  if (!API_KEY) {
    throw new Error("Missing VITE_TMDB_API_KEY environment variable.");
  }

  const url = new URL(`${BASE_URL}${path}`);
  url.search = new URLSearchParams({
    api_key: API_KEY,
    ...params,
  }).toString();

  const response = await fetch(url, { signal });
  if (!response.ok) {
    throw new Error(`TMDB request failed with status ${response.status}.`);
  }

  const data = await response.json();
  return data;
};

const getMovieList = async (path, signal) => {
  const data = await requestTmdb(path, {}, signal);
  return Array.isArray(data.results) ? data.results.filter(Boolean) : [];
};

export const getPopularMovies = (signal) => {
  return getMovieList("/movie/popular", signal);
};

export const getTopRatedMovies = (signal) => {
  return getMovieList("/movie/top_rated", signal);
};

export const getUpcomingMovies = (signal) => {
  return getMovieList("/movie/upcoming", signal);
};

export const searchMovies = async (query, signal) => {
  const data = await requestTmdb("/search/movie", { query }, signal);
  return Array.isArray(data.results) ? data.results.filter(Boolean) : [];
};

export const getMovieDetails = (id, signal) => {
  return requestTmdb(`/movie/${id}`, {}, signal);
};
