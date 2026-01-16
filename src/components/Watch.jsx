import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../css/Watch.css";

function Watch() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`
        );
        const data = await response.json();
        setMovie(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchDetails();
    window.scrollTo(0, 0);
  }, [id]);

  return (
    <div className="watch-page">
      <nav className="watch-nav">
        <button className="back-btn" onClick={() => navigate("/")}>
          ← Back to Browse
        </button>
        <div className="watch-brand">MOVIECORE</div>
      </nav>

      <div className="player-container">
        <div className="video-wrapper">
          <iframe
            src={`https://vidsrc.to/embed/movie/${id}`}
            title="Movie Player"
            allowFullScreen
            className="video-frame"
          />
        </div>
        
        {movie && (
          <div className="movie-details-panel">
            <h1 className="watch-title">{movie.title}</h1>
            <div className="watch-meta">
              <span>{movie.runtime} min</span>
              <span>{movie.release_date?.split('-')[0]}</span>
              <span className="meta-rating">★ {movie.vote_average?.toFixed(1)}</span>
            </div>
            <p className="watch-overview">{movie.overview}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Watch;