import { createContext, useContext, useState } from "react";

const API =
  "https://peanutbutterandjelly-backend-production-ca42.up.railway.app"; //railway or vercel url
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token"));

  //token that allows user to stay logged in, stored in localStorage and state
  function saveToken(t) {
    localStorage.setItem("token", t);
    setToken(t);
  }

  //logout function: removes token from localStorage and state
  function logout() {
    localStorage.removeItem("token");
    setToken(null);
  }

  // fetch wrapper: adds the token and returns { res, data }
  async function api(path, options = {}) {
    const res = await fetch(`${API}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
    const data = await res.json().catch(() => ({}));
    if (data.error === "Invalid token") logout(); // token expired
    return { res, data };
  }

  return (
    <AuthContext.Provider value={{ token, saveToken, logout, api }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
