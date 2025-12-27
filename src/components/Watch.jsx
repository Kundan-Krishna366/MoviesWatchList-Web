import { useParams } from "react-router-dom";

function Watch() {
  const { id } = useParams();

  return (
    <div style={{ padding: "20px" }}>
      <h2>Now Playing</h2>

      <iframe
        src={`https://vidsrc.to/embed/movie/${id}`}
        width="100%"
        height="600"
        allowFullScreen
        frameBorder="0"
        title="Movie Player"
      />
    </div>
  );
}

export default Watch;
