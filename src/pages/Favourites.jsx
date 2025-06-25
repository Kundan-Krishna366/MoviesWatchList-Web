import "../css/Favourites.css";
import { useMovieContext } from "../contexts/MovieContext";
import MovieCard from "../components/MovieCard";

function Favourites() {
  const { favourites } = useMovieContext();

  if (favourites && favourites.length > 0) {
    return (
      <div className="favourites-grid">
        {favourites.map((movie) => (
          <MovieCard movie={movie} key={movie.id} />
        ))}
      </div>
    );
  }

  return (
    <div className="favourites-empty">
      <h2>Nothing here</h2>
      <p>Start adding movies to your favourites and they will appear here</p>
    </div>
  );
}

export default Favourites;
