import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/login";
import { ShaderBackground } from "../components/ShaderBg";

export default function Login() {
  const { api, saveToken } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    const { res, data } = await api("/login", {
      method: "POST",
      body: JSON.stringify({ user_email: email, password }),
    });
    if (!res.ok) return setError(data.error);
    saveToken(data.token);
    navigate("/");
  }

  return (
    <div className="auth-page">
      <ShaderBackground className="auth-bg" />
      <div className="container" style={{ maxWidth: 380, paddingTop: 70 }}>
        <div className="container" style={{ maxWidth: 380, paddingTop: 70 }}>
          <img src="/logo.svg" alt="pbnj logo" className="auth-logo" />
          <h1 className="logo">Peanut Butter & Jelly </h1>
          <p className="tagline">🥜 Spread the love, make some friends! 🍇</p>
          <div className="card">
            <h3 style={{ marginTop: 0 }} className="card-title">
              Welcome back!
            </h3>
            <form onSubmit={handleSubmit}>
              <input
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button type="submit">Log in</button>
            </form>
            {error && <p className="error">{error}</p>}
          </div>
          <p className="switch">
            New here? <Link to="/signup">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
