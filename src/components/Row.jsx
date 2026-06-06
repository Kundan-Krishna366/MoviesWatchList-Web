import { useEffect, useRef, useState } from "react";
import MovieCard from "./MovieCard";
import SkeletonCard from "./SkeletonCard";
import "../css/Row.css";

function Row({ title, fetchFunction, isLargeRow = false }) {
  const [movies, setMovies] = useState([]);
  const [status, setStatus] = useState("loading");
  const rowRef = useRef(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      try {
        setStatus("loading");
        const results = await fetchFunction(controller.signal);
        if (Array.isArray(results)) {
          setMovies(results);
          setStatus("ready");
        }
      } catch (error) {
        if (error.name === "AbortError") return;
        console.error(error);
        setStatus("error");
      }
    };

    fetchData();

    return () => {
      controller.abort();
    };
  }, [fetchFunction]);

  const scrollRow = (direction) => {
    if (!rowRef.current) return;
    const scrollAmount = rowRef.current.clientWidth * 0.82;
    rowRef.current.scrollBy({
      left: direction === "next" ? scrollAmount : -scrollAmount,
      behavior: "smooth",
    });
  };

  const skeletons = Array.from({ length: isLargeRow ? 8 : 6 });

  return (
    <div className="row">
      <div className="row-header">
        <div>
          <span className="row-eyebrow">Curated shelf</span>
          <h2 className="row-title">{title}</h2>
        </div>

        <div className="row-tools">
          {status === "ready" && <span className="row-count">{movies.length} titles</span>}
          <button className="row-nav prev" onClick={() => scrollRow("prev")} aria-label={`Scroll ${title} left`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
          <button className="row-nav next" onClick={() => scrollRow("next")} aria-label={`Scroll ${title} right`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>

      <div className="row-posters" ref={rowRef}>
        {status === "loading" && skeletons.map((_, index) => (
          <SkeletonCard key={index} isLargeRow={isLargeRow} />
        ))}

        {status === "ready" && movies.map((movie) => (
          movie && <MovieCard key={movie.id} movie={movie} isLargeRow={isLargeRow} />
        ))}

        {status === "error" && (
          <div className="row-error">
            <h3>Could not load this shelf</h3>
            <p>Check your connection or TMDB key and try again.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Row;
