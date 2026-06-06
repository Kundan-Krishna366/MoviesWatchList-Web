import { useState, useEffect } from "react";
import { getPopularMovies, getTopRatedMovies, getUpcomingMovies, searchMovies } from "../services/api";
import { useMovieContext } from "../contexts/useMovieContext";
import Row from "../components/Row";
import MovieCard from "../components/MovieCard";
import SkeletonCard from "../components/SkeletonCard";
import "../css/Home.css";
import { useNavigate } from "react-router-dom";

function Home() {
  const { searchQuery, isFavourite, addToFavourites, removeFromFavourites } = useMovieContext();
  const [featuredMovie, setFeaturedMovie] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [searchStatus, setSearchStatus] = useState("idle");
  const navigate = useNavigate();
  const featuredImagePath = featuredMovie?.backdrop_path || featuredMovie?.poster_path;

  useEffect(() => {
    const controller = new AbortController();

    const loadBanner = async () => {
      try {
        const movies = await getPopularMovies(controller.signal);
        if (movies && movies.length > 0) {
          setFeaturedMovie(movies[Math.floor(Math.random() * movies.length)]);
        }
      } catch (error) {
        if (error.name !== "AbortError") console.error(error);
      }
    };

    loadBanner();

    return () => {
      controller.abort();
    };
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setSearchStatus("idle");
      return;
    }

    const controller = new AbortController();
    const searchTimer = window.setTimeout(() => {
      const fetchSearch = async () => {
        setSearchStatus("loading");

        try {
          const results = await searchMovies(searchQuery.trim(), controller.signal);
          setSearchResults(results || []);
          setSearchStatus("ready");
        } catch (error) {
          if (error.name === "AbortError") return;
          console.error(error);
          setSearchStatus("error");
        }
      };

      fetchSearch();
    }, 300);

    return () => {
      window.clearTimeout(searchTimer);
      controller.abort();
    };
  }, [searchQuery]);

  const toggleFeaturedFav = () => {
    if (featuredMovie) {
        if (isFavourite(featuredMovie.id)) {
            removeFromFavourites(featuredMovie.id);
        } else {
            addToFavourites(featuredMovie);
        }
    }
  };

  return (
    <div className="home">
      {!searchQuery && (
        featuredMovie ? (
          <div
            className="hero-banner"
            style={{
              backgroundImage: featuredImagePath
                ? `url("https://image.tmdb.org/t/p/original${featuredImagePath}")`
                : undefined,
            }}
          >
            <div className="hero-overlay"></div>
            <div className="hero-content">
              <div className="hero-kicker">Featured tonight</div>
              <h1 className="hero-title">{featuredMovie.title}</h1>
              <div className="hero-meta">
                <span>{featuredMovie.release_date?.split("-")[0] || "New"}</span>
                <span>★ {featuredMovie.vote_average?.toFixed(1) || "N/A"}</span>
                <span>HD</span>
              </div>
              <p className="hero-desc">
                {featuredMovie.overview
                  ? `${featuredMovie.overview.substring(0, 150)}...`
                  : "A featured pick from Moviecore, ready for your next watch."}
              </p>
              <div className="hero-btns">
                <button className="btn-play" onClick={() => navigate(`/watch/${featuredMovie.id}`)}>
                  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  Play Now
                </button>
                <button className="btn-list" onClick={toggleFeaturedFav}>
                  {isFavourite(featuredMovie.id) ? "✓ Added" : "+ My List"}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="hero-banner hero-loading">
            <div className="hero-content">
              <div className="hero-skeleton kicker"></div>
              <div className="hero-skeleton title"></div>
              <div className="hero-skeleton meta"></div>
              <div className="hero-skeleton copy"></div>
            </div>
          </div>
        )
      )}

      {searchQuery ? (
        <div className="search-section">
          <div className="section-heading">
            <span className="section-eyebrow">Search</span>
            <h2 className="section-title">Results for "{searchQuery}"</h2>
          </div>

          {searchStatus === "loading" && (
            <div className="grid-layout">
              {Array.from({ length: 10 }).map((_, index) => (
                <SkeletonCard key={index} isLargeRow={true} />
              ))}
            </div>
          )}

          {searchStatus === "ready" && searchResults.length > 0 && (
            <div className="grid-layout">
              {searchResults.map((movie) => (
                movie && <MovieCard key={movie.id} movie={movie} isLargeRow={true} />
              ))}
            </div>
          )}

          {searchStatus === "ready" && searchResults.length === 0 && (
            <div className="empty-state">
              <h2>No movies found</h2>
              <p>Try a different title, actor, or keyword.</p>
            </div>
          )}

          {searchStatus === "error" && (
            <div className="empty-state">
              <h2>Search failed</h2>
              <p>Check your connection or TMDB key and try again.</p>
            </div>
          )}
        </div>
      ) : (
        <div className="rows-section">
          <div className="browse-intro">
            <span className="section-eyebrow">Browse</span>
            <h2>Fresh picks for your watchlist</h2>
          </div>
          <Row title="Trending Now" fetchFunction={getPopularMovies} isLargeRow={true} />
          <Row title="Top Rated" fetchFunction={getTopRatedMovies} />
          <Row title="Upcoming" fetchFunction={getUpcomingMovies} />
          <Row title="Popular" fetchFunction={getPopularMovies} />
        </div>
      )}
    </div>
  );
}

export default Home;
