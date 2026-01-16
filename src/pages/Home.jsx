import { useState, useEffect } from "react";
import { getPopularMovies, getTopRatedMovies, getUpcomingMovies, searchMovies } from "../services/api";
import { useMovieContext } from "../contexts/MovieContext";
import Row from "../components/Row";
import MovieCard from "../components/MovieCard";
import "../css/Home.css";
import { useNavigate } from "react-router-dom";

function Home() {
  const { searchQuery, isFavourite, addToFavourites, removeFromFavourites } = useMovieContext();
  const [featuredMovie, setFeaturedMovie] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadBanner = async () => {
      const movies = await getPopularMovies();
      if (movies && movies.length > 0) {
        setFeaturedMovie(movies[Math.floor(Math.random() * movies.length)]);
      }
    };
    loadBanner();
  }, []);

  useEffect(() => {
    const fetchSearch = async () => {
      if (searchQuery.trim()) {
        const results = await searchMovies(searchQuery);
        setSearchResults(results || []);
      } else {
        setSearchResults([]);
      }
    };
    fetchSearch();
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
      {!searchQuery && featuredMovie && (
        <div
          className="hero-banner"
          style={{
            backgroundImage: `url("https://image.tmdb.org/t/p/original${featuredMovie.backdrop_path}")`,
          }}
        >
          <div className="hero-overlay"></div>
          <div className="hero-content">
            <h1 className="hero-title">{featuredMovie.title}</h1>
            <p className="hero-desc">{featuredMovie.overview?.substring(0, 150)}...</p>
            <div className="hero-btns">
              <button className="btn-play" onClick={() => navigate(`/watch/${featuredMovie.id}`)}>
                Play Now
              </button>
              <button className="btn-list" onClick={toggleFeaturedFav}>
                {isFavourite(featuredMovie.id) ? "✓ Added" : "+ My List"}
              </button>
            </div>
          </div>
        </div>
      )}

      {searchQuery ? (
        <div className="search-section">
          <h2 className="section-title">Results for "{searchQuery}"</h2>
          <div className="grid-layout">
            {searchResults.map((movie) => (
              movie && <MovieCard key={movie.id} movie={movie} isLargeRow={true} />
            ))}
          </div>
        </div>
      ) : (
        <div className="rows-section">
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