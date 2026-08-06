import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../lib/api.js";
import { useAuth } from "../../context/AuthContext.jsx";

const initialForm = {
  title: "",
  description: "",
  videoFile: null,
  thumbnail: null,
  publishNow: true
};

export function UploadPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState(null);
  const [thumbnailPreviewUrl, setThumbnailPreviewUrl] = useState(null);
  const [previewModal, setPreviewModal] = useState(null); // "video" | "thumbnail" | null

  useEffect(() => {
    if (!previewModal) return;
    function handleKeyDown(event) {
      if (event.key === "Escape") setPreviewModal(null);
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [previewModal]);

  // Build/revoke object URLs whenever the selected files change, so the
  // preview always matches what's actually about to be uploaded and we
  // don't leak memory by leaving old object URLs alive.
  useEffect(() => {
    if (!form.videoFile) {
      setVideoPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(form.videoFile);
    setVideoPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [form.videoFile]);

  useEffect(() => {
    if (!form.thumbnail) {
      setThumbnailPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(form.thumbnail);
    setThumbnailPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [form.thumbnail]);

  function handleChange(event) {
    const { name, type, checked, value, files } = event.target;

    setForm((current) => ({
      ...current,
      [name]:
        type === "checkbox"
          ? checked
          : type === "file"
            ? files?.[0] || null
            : value
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setResult(null);

    try {
      if (!form.title.trim()) {
        throw new Error("Title is required.");
      }

      if (!form.videoFile) {
        throw new Error("Video file is required.");
      }

      if (!form.thumbnail) {
        throw new Error("Thumbnail is required.");
      }

      const formData = new FormData();
      formData.append("title", form.title.trim());
      formData.append("description", form.description.trim());
      formData.append("videoFile", form.videoFile);
      formData.append("thumbnail", form.thumbnail);

      const uploadResponse = await api.uploadVideo(formData);
      const uploadedVideo = uploadResponse?.data;
      let published = Boolean(uploadedVideo?.isPublished);

      if (form.publishNow && uploadedVideo?._id && !published) {
        try {
          await api.togglePublishStatus(uploadedVideo._id);
          published = true;
        } catch {
          setError("Video uploaded, but publishing it right away failed. It is currently saved as a draft.");
        }
      }

      setResult({
        id: uploadedVideo?._id,
        title: uploadedVideo?.title || form.title.trim(),
        published
      });

      setForm(initialForm);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <section className="page narrow-page">
        <div className="panel">Checking your session...</div>
      </section>
    );
  }

  if (!isAuthenticated) {
    return (
      <section className="page narrow-page">
        <div className="page-header">
          <div>
            <h1>Upload</h1>
            <p className="page-subtle">You need to sign in before you can publish videos.</p>
          </div>
        </div>

        <div className="panel auth-help">
          <p className="page-subtle">
            This page uses the protected `/videos` upload route, so it needs your active login session.
          </p>
          <Link to="/login" className="inline-link">
            Go to login
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="page narrow-page">
      <div className="page-header">
        <div>
          <h1>Upload Video</h1>
          <p className="page-subtle">
            Add a title, description, video file, and thumbnail, then publish it from the frontend.
          </p>
        </div>
      </div>

      <form className="panel form-panel" onSubmit={handleSubmit}>
        <label>
          <span>Title</span>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Give your video a title"
          />
        </label>

        <label>
          <span>Description</span>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Describe what viewers are about to watch"
            rows="5"
          />
        </label>

        <div className="upload-grid">
          <label>
            <span>Video File</span>
            <input
              className="file-input"
              type="file"
              name="videoFile"
              accept="video/*"
              onChange={handleChange}
            />
            <small className="page-subtle">
              {form.videoFile ? form.videoFile.name : "Select the main video file"}
            </small>
            {videoPreviewUrl ? (
              <button
                type="button"
                className="preview-btn"
                onClick={() => setPreviewModal("video")}
              >
                Preview
              </button>
            ) : null}
          </label>

          <label>
            <span>Thumbnail</span>
            <input
              className="file-input"
              type="file"
              name="thumbnail"
              accept="image/*"
              onChange={handleChange}
            />
            <small className="page-subtle">
              {form.thumbnail ? form.thumbnail.name : "Select the preview image"}
            </small>
            {thumbnailPreviewUrl ? (
              <button
                type="button"
                className="preview-btn"
                onClick={() => setPreviewModal("thumbnail")}
              >
                Preview
              </button>
            ) : null}
          </label>
        </div>

        <label className="checkbox-row">
          <input
            type="checkbox"
            name="publishNow"
            checked={form.publishNow}
            onChange={handleChange}
          />
          <span>Publish right after upload</span>
        </label>

        <button type="submit" disabled={submitting}>
          {submitting ? "Uploading..." : "Upload video"}
        </button>
      </form>

      {error ? <div className="panel panel-error">{error}</div> : null}

      {result ? (
        <div className="panel auth-help">
          <h2>Upload complete</h2>
          <p>{result.title}</p>
          <p className="page-subtle">
            Status: {result.published ? "Published" : "Saved as draft"}
          </p>
          <div className="success-actions">
            {result.id ? (
              <Link to={`/watch/${result.id}`} className="inline-link">
                Open watch page
              </Link>
            ) : null}
            <Link to="/" className="inline-link">
              Back to home
            </Link>
          </div>
        </div>
      ) : null}

      {previewModal ? (
        <div className="preview-overlay" onClick={() => setPreviewModal(null)}>
          <div className="preview-modal" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              className="preview-close"
              onClick={() => setPreviewModal(null)}
              aria-label="Close preview"
            >
              ×
            </button>
            {previewModal === "video" && videoPreviewUrl ? (
              <video className="preview-modal-media" src={videoPreviewUrl} controls autoPlay />
            ) : null}
            {previewModal === "thumbnail" && thumbnailPreviewUrl ? (
              <img className="preview-modal-media" src={thumbnailPreviewUrl} alt="Thumbnail preview" />
            ) : null}
          </div>
        </div>
      ) : null}
    </section>
  );
}