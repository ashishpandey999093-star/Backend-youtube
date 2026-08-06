import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../lib/api.js";

export function ChannelPage() {
  const { username } = useParams();
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadChannel() {
      setLoading(true);
      setError("");

      try {
        const response = await api.getChannel(username);
        if (!ignore) {
          setChannel(response?.data || null);
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

    loadChannel();

    return () => {
      ignore = true;
    };
  }, [username]);

  return (
    <section className="page">
      {loading ? <div className="panel">Loading channel...</div> : null}
      {error ? <div className="panel panel-error">{error}</div> : null}

      {!loading && !error && channel ? (
        <div className="panel channel-panel">
          <img className="channel-avatar" src={channel.avatar} alt={channel.username} />
          <div>
            <h1>{channel.fullName}</h1>
            <p className="page-subtle">@{channel.username}</p>
            <p className="video-subtle">
              {channel.subscribersCount} subscribers • {channel.channelsSubscribedToCount} subscribed
            </p>
          </div>
        </div>
      ) : null}
    </section>
  );
}
