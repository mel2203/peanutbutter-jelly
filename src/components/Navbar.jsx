import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../context/login";

export default function Navbar() {
  const { logout, profile } = useAuth();
  const initial = (profile?.username || "Y")[0].toUpperCase();

  return (
    <header className="pb-nav">
      <div className="pb-nav-inner">
        <Link to="/" className="pb-brand">
          <img src="logo.svg" alt="logo icon" />
          <span>
            peanut butter <em>&amp;</em> jelly.
          </span>
        </Link>

        <nav className="pb-links">
          <NavLink to="/" end>
            <img src="home.svg" alt="home icon" />
            <span>Feed</span>
          </NavLink>
          <NavLink to="/friends">
            <img src="friends.svg" alt=" friends icon" />
            <span>Friends</span>
          </NavLink>
          <NavLink to="/profile">
            <img src="profile.svg" alt="profile icon" />
            <span>Profile</span>
          </NavLink>
        </nav>

        <div className="pb-user">
          <Link to="/profile" className="pb-chip">
            <span className="pb-avatar">{initial}</span>
            <span className="pb-chip-name">
              {profile?.username || "Your corner"}
            </span>
          </Link>
          <button className="pb-logout" onClick={logout}>
            Log out
          </button>
        </div>
      </div>
    </header>
  );
}
