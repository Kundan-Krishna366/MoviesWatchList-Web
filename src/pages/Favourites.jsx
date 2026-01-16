import "../css/Favourites.css";
import { useMovieContext } from "../contexts/MovieContext";
import MovieCard from "../components/MovieCard";

function Favourites() {
  const { favourites } = useMovieContext();

  return (
    <div className="favourites-page">
      <h1 className="fav-title">My List</h1>
      {favourites && favourites.length > 0 ? (
        <div className="fav-grid">
          {favourites.map((movie) => (
            <MovieCard key={movie.id} movie={movie} isLargeRow={true} />
          ))}
        </div>
      ) : (
        <div className="fav-empty">
          <h2>Your list is empty</h2>
          <p>Movies you add will appear here.</p>
        </div>
      )}
    </div>
  );
}

export default Favourites;