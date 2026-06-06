import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMovieDetails } from "../services/api";
import "../css/Watch.css";

function Watch() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const controller = new AbortController();

    const fetchDetails = async () => {
      try {
        setStatus("loading");
        const data = await getMovieDetails(id, controller.signal);
        setMovie(data);
        setStatus("ready");
      } catch (error) {
        if (error.name === "AbortError") return;
        console.error(error);
        setStatus("error");
      }
    };

    fetchDetails();
    window.scrollTo(0, 0);

    return () => {
      controller.abort();
    };
  }, [id]);

  return (
    <div className="watch-page">
      <nav className="watch-nav">
        <button className="back-btn" onClick={() => navigate("/")}>
          <span aria-hidden="true">←</span>
          Back to Browse
        </button>
        <div className="watch-brand">MOVIECORE<span>.</span></div>
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
        
        {status === "loading" && (
          <div className="movie-details-panel details-loading">
            <div className="watch-poster-skeleton"></div>
            <div className="watch-copy-skeleton">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="movie-details-panel">
            <h1 className="watch-title">Details unavailable</h1>
            <p className="watch-overview">Check your connection or TMDB key and try again.</p>
          </div>
        )}

        {status === "ready" && movie && (
          <div className={`movie-details-panel ${!movie.poster_path ? "no-poster" : ""}`}>
            {movie.poster_path && (
              <img
                className="watch-poster"
                src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`}
                alt={movie.title}
              />
            )}
            <div className="watch-copy">
              <h1 className="watch-title">{movie.title}</h1>
              <div className="watch-meta">
                <span>{movie.runtime ? `${movie.runtime} min` : "Runtime N/A"}</span>
                <span>{movie.release_date?.split('-')[0] || "Year N/A"}</span>
                <span className="meta-rating">★ {Number.isFinite(movie.vote_average) ? movie.vote_average.toFixed(1) : "N/A"}</span>
              </div>
              {movie.genres?.length > 0 && (
                <div className="watch-genres">
                  {movie.genres.slice(0, 4).map((genre) => (
                    <span key={genre.id}>{genre.name}</span>
                  ))}
                </div>
              )}
              <p className="watch-overview">{movie.overview || "No overview is available for this title yet."}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Watch;
