import "../css/MovieCard.css";
import { useMovieContext } from "../contexts/useMovieContext";
import { useNavigate } from "react-router-dom";

const PLACEHOLDER_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='500' height='750' viewBox='0 0 500 750'%3E%3Crect width='500' height='750' fill='%23111111'/%3E%3Crect x='34' y='34' width='432' height='682' rx='24' fill='%231b1b1b' stroke='%23333333'/%3E%3Ctext x='250' y='382' fill='%23a7a7a7' font-family='Arial,sans-serif' font-size='34' font-weight='700' text-anchor='middle'%3ENo Image%3C/text%3E%3C/svg%3E";

function MovieCard({ movie, isLargeRow }) {
  const { isFavourite, addToFavourites, removeFromFavourites } = useMovieContext();
  const navigate = useNavigate();

  if (!movie) return null;

  const favourite = isFavourite(movie.id);
  const imagePath = isLargeRow ? movie.poster_path : movie.backdrop_path;
  const title = movie.title || movie.name || "Untitled";
  const year = movie.release_date?.split("-")[0] || "New";
  const rating = Number.isFinite(movie.vote_average) ? movie.vote_average.toFixed(1) : "N/A";
  const imageSize = isLargeRow ? "w342" : "w500";
  const imageUrl = imagePath 
    ? `https://image.tmdb.org/t/p/${imageSize}${imagePath}` 
    : PLACEHOLDER_IMAGE;

  const onWatchClick = () => {
    navigate(`/watch/${movie.id}`);
  };

  const onFavouriteClick = (e) => {
    e.stopPropagation();
    if (favourite) removeFromFavourites(movie.id);
    else addToFavourites(movie);
  };

  const stopControlKeyDown = (e) => {
    e.stopPropagation();
  };

  return (
    <div 
      className={`movie-card ${isLargeRow ? "portrait" : "landscape"}`} 
      onClick={onWatchClick}
    >
      <div className="image-wrapper">
        <img
          src={imageUrl}
          alt={title}
          className="card-img"
          loading="lazy"
        />

        <div className="poster-glow"></div>
        <div className="card-badges">
          <div className="badge-stack">
            <span className="quality-badge">HD</span>
            <span className="score-badge">★ {rating}</span>
          </div>
          <button
            className={`quick-fav ${favourite ? "active" : ""}`}
            onClick={onFavouriteClick}
            onKeyDown={stopControlKeyDown}
            aria-label={favourite ? "Remove from My List" : "Add to My List"}
          >
            <svg viewBox="0 0 24 24" fill={favourite ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" width="18" height="18">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </button>
        </div>
        
        <div className="card-overlay">
          <div className="overlay-actions">
            <button className="icon-btn play" aria-label={`Watch ${title}`}>
              <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M8 5v14l11-7z"/></svg>
            </button>
          </div>
          <span className="watch-pill">Watch now</span>
        </div>
      </div>

      <div className="card-info">
        <h3 className="card-title">{title}</h3>
        <div className="card-meta">
          <span>{year}</span>
          <span className="divider"></span>
          <span className="rating">★ {rating}</span>
        </div>
      </div>
    </div>
  );
}

export default MovieCard;
