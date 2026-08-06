import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../../lib/api.js";
import { VideoCard } from "../../components/video/VideoCard.jsx";

export function HomePage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusMessage, setStatusMessage] = useState("Waiting for video data");

  useEffect(() => {
    let ignore = false;

    async function load() {
      setLoading(true);
      setError("");

      try {
        const videoResponse = await api.getVideos(query);

        if (ignore) {
          return;
        }

        setStatusMessage("Backend connected");
        setVideos(videoResponse?.data?.docs || []);
      } catch (err) {
        if (!ignore) {
          setError(err.message);
          setStatusMessage("Backend unavailable");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      ignore = true;
    };
  }, [query]);

  return (
    <section className="page">
      <div className="page-header">
        <div>
          <h1>Explore</h1>
          <p className="page-subtle">
            Basic frontend wired to your `videos` route.
          </p>
        </div>
        <span className="status-pill">{statusMessage}</span>
      </div>

      {loading ? <div className="panel">Loading videos...</div> : null}
      {error ? <div className="panel panel-error">{error}</div> : null}

      {!loading && !error ? (
        <div className="video-grid">
          {videos.length ? (
            videos.map((video) => <VideoCard key={video._id} video={video} />)
          ) : (
            <div className="panel">No videos found for this query.</div>
          )}
        </div>
      ) : null}
    </section>
  );
}
