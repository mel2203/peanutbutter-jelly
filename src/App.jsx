import { Routes, Route, Navigate, Outlet, NavLink } from "react-router-dom";
import { useAuth } from "./context/login";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Feed from "./pages/feed";
import Friends from "./pages/friends";
import Profile from "./pages/profile";

function Layout() {
  const { token, logout } = useAuth();
  if (!token) return <Navigate to="/login" replace />;

  return (
    <div className="container">
      <header className="topbar">
        <span className="wordmark">
          peanut butter <em>&amp;</em> jelly
        </span>
        <nav className="nav">
          <NavLink to="/" end>
            Feed
          </NavLink>
          <NavLink to="/friends">Friends</NavLink>
          <NavLink to="/profile">Profile</NavLink>
        </nav>
        <button className="secondary" onClick={logout}>
          Log out
        </button>
      </header>
      <Outlet />
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route element={<Layout />}>
        <Route path="/" element={<Feed />} />
        <Route path="/friends" element={<Friends />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
    </Routes>
  );
}
