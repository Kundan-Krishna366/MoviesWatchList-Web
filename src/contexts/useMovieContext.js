import { useContext } from "react";
import { MovieContext } from "./MovieContextCore";

export const useMovieContext = () => useContext(MovieContext);
