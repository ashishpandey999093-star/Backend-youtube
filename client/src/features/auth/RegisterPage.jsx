import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { api } from "../../lib/api.js";
import { useAuth } from "../../context/AuthContext.jsx";

const initialForm = {
  fullName: "",
  email: "",
  username: "",
  password: ""
};

export function RegisterPage() {
  const navigate = useNavigate();
  const { isAuthenticated, refreshSession } = useAuth();
  const [form, setForm] = useState(initialForm);
  const [avatar, setAvatar] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (!avatar) {
        throw new Error("Avatar image is required.");
      }

      const data = new FormData();
      data.append("fullName", form.fullName.trim());
      data.append("email", form.email.trim());
      data.append("username", form.username.trim());
      data.append("password", form.password);
      data.append("avatar", avatar);
      if (coverImage) {
        data.append("coverImage", coverImage);
      }

      await api.register(data);

      // Registration doesn't log the user in — send them to login next,
      // matching how /users/login is the only endpoint that issues tokens.
      await api.login({ username: form.username.trim(), password: form.password });
      const sessionUser = await refreshSession();

      if (!sessionUser) {
        throw new Error("Account created, but session could not be started. Please log in.");
      }

      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <section className="page narrow-page">
      <div className="page-header">
        <div>
          <h1>Create account</h1>
          <p className="page-subtle">
            Starter form for your `/users/register` endpoint.
          </p>
        </div>
      </div>

      <form className="panel form-panel" onSubmit={handleSubmit}>
        <label>
          <span>Full name *</span>
          <input
            type="text"
            name="fullName"
            value={form.fullName}
            onChange={updateField}
            placeholder="Enter full name"
          />
        </label>

        <label>
          <span>Username *</span>
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={updateField}
            placeholder="Enter username"
          />
        </label>

        <label>
          <span>Email *</span>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={updateField}
            placeholder="Enter email"
          />
        </label>

        <label>
          <span>Password *</span>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={updateField}
            placeholder="Enter password"
          />
        </label>

        <label>
          <span>Avatar *(required)</span>
          <input
            type="file"
            name="avatar"
            accept="image/*"
            onChange={(event) => setAvatar(event.target.files[0] || null)}
          />
        </label>

        <label>
          <span>Cover image (optional)</span>
          <input
            type="file"
            name="coverImage"
            accept="image/*"
            onChange={(event) => setCoverImage(event.target.files[0] || null)}
          />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? "Creating account..." : "Create account"}
        </button>
      </form>

      {error ? <div className="panel panel-error">{error}</div> : null}
      <div className="panel auth-help">
        <p className="page-subtle">Already have an account?</p>
        <Link to="/login" className="inline-link">
          Go to login
        </Link>
      </div>
    </section>
  );
}