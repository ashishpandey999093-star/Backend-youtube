import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { api } from "../../lib/api.js";
import { useAuth } from "../../context/AuthContext.jsx";

const initialForm = {
  identifier: "",
  password: ""
};

function EyeIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M3 3l18 18" />
      <path d="M10.6 10.7A3 3 0 0 0 13.4 13.5" />
      <path d="M9.9 5.1A10.9 10.9 0 0 1 12 5c6.4 0 10 7 10 7a16.7 16.7 0 0 1-4.2 5.1" />
      <path d="M6.7 6.8C4.3 8.4 2.8 10.9 2 12c0 0 3.6 7 10 7a10.8 10.8 0 0 0 4-.7" />
    </svg>
  );
}

export function LoginPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated, refreshSession } = useAuth();
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const identifier = form.identifier.trim();
      const payload = {
        password: form.password
      };

      if (!identifier) {
        throw new Error("Username / Email is required.");
      }

      if (identifier.includes("@")) {
        payload.email = identifier;
      } else {
        payload.username = identifier;
      }

      await api.login(payload);
      const sessionUser = await refreshSession();

      if (!sessionUser) {
        throw new Error("Login succeeded but no active session was found.");
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
          <h1>Login</h1>
          <p className="page-subtle">
            Starter form for your `/users/login` endpoint.
          </p>
        </div>
      </div>

      <form className="panel form-panel" onSubmit={handleSubmit}>
        <label>
          <span>Username / Email</span>
          <input
            type="text"
            name="identifier"
            value={form.identifier}
            onChange={updateField}
            placeholder="Enter username / email"
          />
        </label>

        <label>
          <span>Password</span>
          <div className="input-with-action">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={updateField}
              placeholder="Enter password"
            />
            <button
              type="button"
              className="input-action"
              onClick={() => setShowPassword((current) => !current)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              title={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOffIcon className="input-action-icon" />
              ) : (
                <EyeIcon className="input-action-icon" />
              )}
            </button>
          </div>
        </label>

        <button type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>

      {error ? <div className="panel panel-error">{error}</div> : null}
      <div className="panel auth-help">
        <h2>Session</h2>
        <p className="page-subtle">
          After login, the app calls `/users/current-user` to confirm the cookie-based session.
        </p>
        <p className="page-subtle">
          Current state: {user ? `@${user.username}` : "signed out"}
        </p>
        <Link to="/" className="inline-link">
          Back to home
        </Link>
        <p className="page-subtle">
          No account yet? <Link to="/register" className="inline-link">Create one</Link>
        </p>
      </div>
    </section>
  );
}
