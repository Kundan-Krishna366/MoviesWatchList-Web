import MovieCard from "../components/MovieCard";
import { useState, useEffect, useRef } from "react";
import { searchMovies, getPopularMovies } from "../services/api";
import "../css/Home.css";

function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const containerRef = useRef(null);   // 👈 scroll container
  const loadMoreRef = useRef(null);    // 👈 sentinel

  // Fetch movies
  useEffect(() => {
    const loadMovies = async () => {
      try {
        setLoading(true);

        const data = searchQuery
          ? await searchMovies(searchQuery, page)
          : await getPopularMovies(page);

        setMovies((prev) =>
          page === 1 ? data || [] : [...prev, ...(data || [])]
        );

        setHasMore(data && data.length > 0);
        setError(null);
      } catch (err) {
        setError("Failed to load movies");
      } finally {
        setLoading(false);
      }
    };

    loadMovies();
  }, [page, searchQuery]);

  // IntersectionObserver (FIXED FOR MOBILE)
  useEffect(() => {
    if (loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      },
      {
        root: containerRef.current, // ✅ THIS FIXES MOBILE
        rootMargin: "200px",
        threshold: 0,
      }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [loading, hasMore]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setMovies([]);
    setPage(1);
    setHasMore(true);
  };

  return (
    <div className="home" ref={containerRef}>
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Search for movies.."
          className="search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button className="search-btn" type="submit">
          Search
        </button>
      </form>

      {error && <div className="error-message">{error}</div>}

      <div className="movies-grid">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>

      {/* sentinel */}
      <div ref={loadMoreRef} style={{ height: "1px" }} />

      {loading && <div className="loading">Loading more...</div>}
      {!hasMore && !loading && (
        <div className="loading">No more movies</div>
      )}
    </div>
  );
}

export default Home;
