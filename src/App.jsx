import { Routes, Route, Navigate, NavLink } from "react-router-dom";
import { useAuth } from "./context/login";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Feed from "./pages/feed";
import Friends from "./pages/friends";

function Protected({ children }) {
  const { token, logout } = useAuth();
  if (!token) return <Navigate to="/login" replace />;

  return (
    <div className="container">
      <h1 className="logo">🥜 Peanut Butter & Jelly 🍇</h1>
      <div className="nav">
        <NavLink to="/">Feed</NavLink>
        <NavLink to="/friends">Friends</NavLink>
        <button className="secondary" onClick={logout}>
          Log out
        </button>
      </div>
      {children}
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route
        path="/"
        element={
          <Protected>
            <Feed />
          </Protected>
        }
      />
      <Route
        path="/friends"
        element={
          <Protected>
            <Friends />
          </Protected>
        }
      />
    </Routes>
  );
}
