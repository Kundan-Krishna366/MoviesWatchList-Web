import "../css/SkeletonCard.css";

function SkeletonCard({ isLargeRow = false }) {
  return (
    <div className={`skeleton-card ${isLargeRow ? "portrait" : "landscape"}`} aria-hidden="true">
      <div className="skeleton-poster"></div>
      <div className="skeleton-line title"></div>
      <div className="skeleton-line meta"></div>
    </div>
  );
}

export default SkeletonCard;
