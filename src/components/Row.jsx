import { useEffect, useState } from "react";
import MovieCard from "./MovieCard";
import "../css/Row.css";

function Row({ title, fetchFunction, isLargeRow = false }) {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const results = await fetchFunction();
        if (Array.isArray(results)) {
          setMovies(results);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [fetchFunction]);

  return (
    <div className="row">
      <h2 className="row-title">{title}</h2>
      <div className="row-posters">
        {movies.map((movie) => (
          movie && <MovieCard key={movie.id} movie={movie} isLargeRow={isLargeRow} />
        ))}
      </div>
    </div>
  );
}

export default Row;