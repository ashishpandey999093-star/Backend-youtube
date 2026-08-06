import { Link, NavLink, useNavigate } from "react-router-dom";
import { SearchBar } from "./SearchBar.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

export function AppShell({ children }) {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  const navItems = [{ to: "/", label: "Home" }];

  if (isAuthenticated) {
    navItems.push({ to: "/upload", label: "Upload" });
  } else {
    navItems.push({ to: "/login", label: "Login" });
  }

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand-row">
          <Link to="/" className="brand">
            <span className="brand-mark">S</span>
            <span>StreamHub</span>
          </Link>
          <SearchBar />
          <div className="topbar-actions">
            {isLoading ? <span className="session-badge">Checking session</span> : null}
            {!isLoading && isAuthenticated ? (
              <>
                <div className="user-chip">
                  <span className="user-chip-name">{user.fullName}</span>
                  <span className="user-chip-handle">@{user.username}</span>
                </div>
                <button type="button" className="ghost-button" onClick={handleLogout}>
                  Logout
                </button>
              </>
            ) : null}
          </div>
        </div>
      </header>

      <div className="shell-body">
        <aside className="sidebar">
          <nav className="sidebar-nav">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  `nav-link${isActive ? " nav-link-active" : ""}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <main className="content">{children}</main>
      </div>
    </div>
  );
}
