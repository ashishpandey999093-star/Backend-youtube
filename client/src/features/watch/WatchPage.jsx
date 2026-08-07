import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../lib/api.js";

function WatchPage() {
  const { videoId } = useParams();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    api.getVideoById(videoId)
      .then((response) => {
        setVideo(response.data.data);
      })
      .catch(() => {
        setError("Could not load this video.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [videoId]);

  if (loading) return <p>Loading video...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!video) return null;

  return (
    <div>
      <video
        src={video.videoFile}
        controls
        width="640"
        style={{ maxWidth: "100%" }}
      />
      <h2>{video.title}</h2>
      <p>{video.description}</p>
    </div>
  );
}

export default WatchPage;