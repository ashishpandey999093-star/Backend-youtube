import { Link } from "react-router-dom";

function formatViews(views) {
  const count = Number(views || 0);
  return `${count.toLocaleString()} views`;
}

export function VideoCard({ video }) {
  return (
    <article className="video-card">
      <Link to={`/watch/${video._id}`} className="video-thumb-link">
        <img
          className="video-thumb"
          src={video.thumbnail}
          alt={video.title}
          loading="lazy"
        />
      </Link>
      <div className="video-meta">
        <h3>
          <Link to={`/watch/${video._id}`}>{video.title}</Link>
        </h3>
        <Link className="channel-link" to={`/channel/${video.owner?.username}`}>
          {video.owner?.fullName || video.owner?.username || "Unknown channel"}
        </Link>
        <p className="video-subtle">
          {formatViews(video.views)} • {video.duration || 0}s
        </p>
      </div>
    </article>
  );
}
