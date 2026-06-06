import { useCallback, useEffect, useMemo, useState } from "react";
import { MovieContext } from "./MovieContextCore";

export const MovieProvider = ({ children }) => {
  const [favourites, setFavourites] = useState(() => {
    try {
      const stored = localStorage.getItem("favourites");
      const parsed = stored ? JSON.parse(stored) : [];
      return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
    } catch (error) {
      console.error("Failed to read favourites from local storage.", error);
      return [];
    }
  });

  const [searchQuery, setSearchQuery] = useState(""); 

  useEffect(() => {
    try {
      localStorage.setItem("favourites", JSON.stringify(favourites));
    } catch (error) {
      console.error("Failed to save favourites to local storage.", error);
    }
  }, [favourites]);

  const addToFavourites = useCallback((movie) => {
    if (!movie?.id) return;
    setFavourites((prev) => {
      if (prev.some(m => m.id === movie.id)) return prev;
      return [...prev, movie];
    });
  }, []);

  const removeFromFavourites = useCallback((movieId) => {
    setFavourites((prev) => prev.filter((movie) => movie.id !== movieId));
  }, []);

  const clearFavourites = useCallback(() => {
    setFavourites([]);
  }, []);

  const isFavourite = useCallback((movieId) => {
    return favourites.some((movie) => movie.id === movieId);
  }, [favourites]);

  const value = useMemo(() => ({
    favourites,
    addToFavourites,
    removeFromFavourites,
    clearFavourites,
    isFavourite,
    searchQuery,
    setSearchQuery
  }), [addToFavourites, clearFavourites, favourites, isFavourite, removeFromFavourites, searchQuery]);

  return <MovieContext.Provider value={value}>{children}</MovieContext.Provider>;
};
