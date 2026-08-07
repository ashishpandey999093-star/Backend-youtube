import { Link } from "react-router-dom";

function VideoCard({ video }) {
  return (
    <Link to={`/watch/${video._id}`} className="video-card">
      <img src={video.thumbnail} alt={video.title} />
      <p>{video.title}</p>
    </Link>
  );
}

export default VideoCard;