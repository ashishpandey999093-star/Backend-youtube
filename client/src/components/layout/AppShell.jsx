import { Link } from "react-router-dom";
import SearchBar from "./SearchBar.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

function AppShell({ children }) {
  const { user, loading, logout } = useAuth();

  return (
    <div className="app-shell">
      <header className="app-header">
        <Link to="/" className="brand">
          <span className="signal-dot" />
          <h1>StreamHub</h1>
        </Link>

        <SearchBar />

        <div className="nav-actions">
          {loading ? null : user ? (
            <>
              <span className="username">{user.username}</span>
              <button className="btn btn-danger" onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost">Login</Link>
              <Link to="/register" className="btn btn-primary">Register</Link>
            </>
          )}
        </div>
      </header>
      <main className="app-main">{children}</main>
    </div>
  );
}

export default AppShell;