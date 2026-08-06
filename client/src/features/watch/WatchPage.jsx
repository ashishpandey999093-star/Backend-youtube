import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../../lib/api.js";
import { useAuth } from "../../context/AuthContext.jsx";

export function WatchPage() {
  const { videoId } = useParams();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [liked, setLiked] = useState(false);
  const [likePending, setLikePending] = useState(false);
  const [likeError, setLikeError] = useState("");

  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentsError, setCommentsError] = useState("");
  const [newComment, setNewComment] = useState("");
  const [postingComment, setPostingComment] = useState(false);

  useEffect(() => {
    let ignore = false;

    async function loadVideo() {
      setLoading(true);
      setError("");

      try {
        const response = await api.getVideoById(videoId);
        if (!ignore) {
          setVideo(response?.data || null);
        }
      } catch (err) {
        if (!ignore) {
          setError(err.message);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadVideo();

    return () => {
      ignore = true;
    };
  }, [videoId]);

  useEffect(() => {
    if (!isAuthenticated) return;
    let ignore = false;

    async function loadComments() {
      setCommentsLoading(true);
      setCommentsError("");

      try {
        const response = await api.getComments(videoId);
        if (!ignore) {
          setComments(response?.data?.docs || []);
        }
      } catch (err) {
        if (!ignore) {
          setCommentsError(err.message);
        }
      } finally {
        if (!ignore) {
          setCommentsLoading(false);
        }
      }
    }

    loadComments();

    return () => {
      ignore = true;
    };
  }, [videoId, isAuthenticated]);

  async function handleToggleLike() {
    setLikePending(true);
    setLikeError("");

    try {
      const response = await api.toggleVideoLike(videoId);
      // The backend doesn't return a liked/unliked flag — it only
      // returns a message, so we read that to know which way it went.
      setLiked(!/unliked/i.test(response?.message || ""));
    } catch (err) {
      setLikeError(err.message);
    } finally {
      setLikePending(false);
    }
  }

  async function handleAddComment(event) {
    event.preventDefault();
    const content = newComment.trim();
    if (!content) return;

    setPostingComment(true);
    setCommentsError("");

    try {
      const response = await api.addComment(videoId, content);
      const created = response?.data;
      // addComment doesn't populate the owner, so show the current
      // session's identity locally instead of leaving it blank.
      setComments((current) => [{ ...created, owner: null, _justPosted: true }, ...current]);
      setNewComment("");
    } catch (err) {
      setCommentsError(err.message);
    } finally {
      setPostingComment(false);
    }
  }

  return (
    <section className="page">
      {loading ? <div className="panel">Loading video...</div> : null}
      {error ? <div className="panel panel-error">{error}</div> : null}

      {!loading && !error && video ? (
        <div className="watch-layout">
          <div className="player-frame">
            <video
              className="watch-video"
              src={video.videoFile}
              poster={video.thumbnail}
              controls
            />
          </div>

          <div className="watch-meta">
            <h1>{video.title}</h1>

            <div className="watch-actions">
              {isAuthenticated ? (
                <button
                  type="button"
                  className={`like-btn${liked ? " like-btn-active" : ""}`}
                  onClick={handleToggleLike}
                  disabled={likePending}
                >
                  {liked ? "Liked" : "Like"}
                </button>
              ) : (
                <Link to="/login" className="ghost-button">
                  Log in to like this video
                </Link>
              )}
              <p className="video-subtle">{Number(video.views || 0).toLocaleString()} views</p>
            </div>
            {likeError ? <div className="panel panel-error">{likeError}</div> : null}

            <p className="page-subtle">{video.description || "No description yet."}</p>
            {video.owner?.username ? (
              <Link className="channel-link" to={`/channel/${video.owner.username}`}>
                Visit channel
              </Link>
            ) : null}
          </div>

          <div className="comments-section">
            <h2>Comments</h2>

            {!authLoading && !isAuthenticated ? (
              <div className="panel auth-help">
                <p className="page-subtle">
                  This backend requires a login to view or post comments.
                </p>
                <Link to="/login" className="inline-link">
                  Go to login
                </Link>
              </div>
            ) : null}

            {isAuthenticated ? (
              <>
                <form className="panel comment-form" onSubmit={handleAddComment}>
                  <input
                    type="text"
                    value={newComment}
                    onChange={(event) => setNewComment(event.target.value)}
                    placeholder="Add a comment..."
                  />
                  <button type="submit" disabled={postingComment || !newComment.trim()}>
                    {postingComment ? "Posting..." : "Post"}
                  </button>
                </form>

                {commentsError ? <div className="panel panel-error">{commentsError}</div> : null}
                {commentsLoading ? <div className="panel">Loading comments...</div> : null}

                {!commentsLoading && comments.length === 0 ? (
                  <p className="page-subtle">No comments yet. Be the first to comment.</p>
                ) : null}

                <ul className="comment-list">
                  {comments.map((comment) => (
                    <li key={comment._id} className="comment-item">
                      <span className="comment-author">
                        {comment._justPosted
                          ? "You"
                          : comment.owner?.fullName || "Unknown user"}
                      </span>
                      <p>{comment.content}</p>
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
          </div>
        </div>
      ) : null}
    </section>
  );
}