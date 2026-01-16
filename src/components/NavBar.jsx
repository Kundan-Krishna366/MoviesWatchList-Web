import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMovieContext } from "../contexts/MovieContext";
import "../css/NavBar.css";

function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const { searchQuery, setSearchQuery } = useMovieContext();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    if (window.location.pathname !== "/") {
      navigate("/");
    }
  };

  const resetSearch = () => {
    setSearchQuery("");
    window.scrollTo(0, 0);
  };

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="nav-container">
        
        <div className="nav-left">
          <Link to="/" className="brand" onClick={resetSearch}>
            MOVIECORE<span className="dot">.</span>
          </Link>
          
          <div className="nav-links">
            <Link to="/" className="nav-link" onClick={resetSearch}>Home</Link>
            <Link to="/favourites" className="nav-link">My List</Link>
          </div>
        </div>

        <div className="nav-right">
          <div className="search-box">
            <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input 
              type="text" 
              placeholder="Search movies..." 
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
        </div>

      </div>
    </nav>
  );
}

export default NavBar;