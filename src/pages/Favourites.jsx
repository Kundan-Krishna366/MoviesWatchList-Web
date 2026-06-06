import "../css/Favourites.css";
import { useMovieContext } from "../contexts/useMovieContext";
import MovieCard from "../components/MovieCard";

function Favourites() {
  const { favourites, clearFavourites } = useMovieContext();

  const clearList = () => {
    if (window.confirm("Clear every movie from My List?")) {
      clearFavourites();
    }
  };

  return (
    <div className="favourites-page">
      <header className="fav-header">
        <div>
          <span className="fav-eyebrow">Saved collection</span>
          <h1 className="fav-title">My List</h1>
          <p>{favourites.length} {favourites.length === 1 ? "movie" : "movies"} saved</p>
        </div>
        {favourites.length > 0 && (
          <button className="fav-clear" onClick={clearList}>
            Clear list
          </button>
        )}
      </header>

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
