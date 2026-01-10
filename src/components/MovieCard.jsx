import "../css/MovieCard.css";
import { useMovieContext } from "../contexts/MovieContext";
import { Link } from "react-router-dom";

function MovieCard({ movie }) {
  const { isFavourite, addToFavourites, removeFromFavourites } =
    useMovieContext();

  const favourite = isFavourite(movie.id);

  const onFavouriteClick = (e) => {
    e.preventDefault();
    if (favourite) {
      removeFromFavourites(movie.id);
    } else {
      addToFavourites(movie);
    }
  };

  return (
    <div className="movie-card">
      <div className="movie-poster">
        <img
          src={
            movie.poster_path
              ? `https://image.tmdb.org/t/p/w185${movie.poster_path}`
              : "/placeholder.png"
          }
          alt={movie.title}
          loading="lazy"
          decoding="async"
        />

        <div className="movie-overlay">
          <button
            className={`favourite-btn ${favourite ? "active" : ""}`}
            onClick={onFavouriteClick}
          >
            ♥
          </button>
        </div>
      </div>

      <div className="movie-info">
        <h3>{movie.title}</h3>
        <p>{movie.release_date?.split("-")[0]}</p>

        <Link to={`/watch/${movie.id}`} className="watch-btn">
          Watch
        </Link>
      </div>
    </div>
  );
}

export default MovieCard;
