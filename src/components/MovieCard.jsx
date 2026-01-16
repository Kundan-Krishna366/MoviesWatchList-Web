import "../css/MovieCard.css";
import { useMovieContext } from "../contexts/MovieContext";
import { useNavigate } from "react-router-dom";

function MovieCard({ movie, isLargeRow }) {
  const { isFavourite, addToFavourites, removeFromFavourites } = useMovieContext();
  const navigate = useNavigate();

  if (!movie) return null;

  const favourite = isFavourite(movie.id);
  const imagePath = isLargeRow ? movie.poster_path : movie.backdrop_path;
  const imageUrl = imagePath 
    ? `https://image.tmdb.org/t/p/w500${imagePath}` 
    : "https://via.placeholder.com/500x281?text=No+Image";

  const onWatchClick = () => {
    navigate(`/watch/${movie.id}`);
  };

  const onFavouriteClick = (e) => {
    e.stopPropagation();
    if (favourite) removeFromFavourites(movie.id);
    else addToFavourites(movie);
  };

  return (
    <div 
      className={`movie-card ${isLargeRow ? "portrait" : "landscape"}`} 
      onClick={onWatchClick}
    >
      <div className="image-wrapper">
        <img
          src={imageUrl}
          alt={movie.title}
          className="card-img"
          loading="lazy"
        />
        
        <div className="overlay-btns">
            <button className="icon-btn play">
                <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M8 5v14l11-7z"/></svg>
            </button>
            <button className={`icon-btn list ${favourite ? 'active' : ''}`} onClick={onFavouriteClick}>
                <svg viewBox="0 0 24 24" fill={favourite ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" width="24" height="24">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
            </button>
        </div>
      </div>

      <div className="card-info">
        <h3 className="card-title">{movie.title || movie.name}</h3>
        <div className="card-meta">
          <span>{movie.release_date?.split('-')[0] || "N/A"}</span>
          <span className="rating">★ {movie.vote_average?.toFixed(1)}</span>
        </div>
      </div>
    </div>
  );
}

export default MovieCard;