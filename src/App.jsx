import { Routes, Route, Navigate, Outlet, NavLink } from "react-router-dom";
import { useAuth } from "./context/login";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Feed from "./pages/feed";
import Friends from "./pages/friends";
import Profile from "./pages/profile";
import Navbar from "./components/Navbar";
import { useEffect } from "react";

function Layout() {
  const { token, me, api, setProfile } = useAuth();
  useEffect(() => {
    if (!me) return;
    async function init() {
      const { res, data } = await api(`/profiles/${me.user_id}`);
      if (res.ok) setProfile(data);
    }
    init();
  }, []);

  if (!token) return <Navigate to="/login" replace />;
  return (
    <div className="pb-app">
      <Navbar />
      <main className="pb-main">
        <Outlet />
      </main>
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
