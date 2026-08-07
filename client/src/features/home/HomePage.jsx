import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../../lib/api.js";
import VideoCard from "../../components/video/VideoCard.jsx";

function HomePage() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query") || "";

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    api.getVideos(query)
      .then((response) => {
        setVideos(response.data.data.docs);
      })
      .catch(() => {
        setError("Could not load videos.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [query]);

  if (loading) return <p className="state-text">Loading videos...</p>;
  if (error) return <p className="state-text error-text">{error}</p>;

  return (
    <div>
      <h2>Videos</h2>
      <div className="video-grid" style={{ marginTop: "20px" }}>
        {videos.map((video) => (
          <VideoCard key={video._id} video={video} />
        ))}
      </div>
    </div>
  );
}

export default HomePage;