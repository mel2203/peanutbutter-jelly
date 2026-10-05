import { useState, useEffect } from "react";
import { useAuth } from "../context/login";

export default function Profile() {
  const { api, me } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    username: "",
    age: "",
    bio: "",
    city: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    async function init() {
      const { res, data } = await api(`/profiles/${me.user_id}`);
      if (res.ok) setProfile(data);
      setLoaded(true);
    }
    init();
  }, []);

  function startEdit() {
    setForm({
      username: profile.username || "",
      age: profile.age || "",
      bio: profile.bio || "",
      city: profile.city || "",
    });
    setEditing(true);
  }

  function change(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function save(e) {
    e.preventDefault();
    setError("");
    const { res, data } = await api("/profiles", {
      method: profile ? "PATCH" : "POST",
      body: JSON.stringify({
        username: form.username,
        age: form.age ? Number(form.age) : undefined,
        bio: form.bio,
        city: form.city,
      }),
    });
    if (!res.ok) return setError(data.error);
    setProfile(data);
    setEditing(false);
  }

  if (!loaded) return <p className="switch">Loading...</p>;

  // create or edit form
  if (!profile || editing) {
    return (
      <div className="card">
        <h3>{profile ? "Edit profile" : "Create your profile"}</h3>
        <form onSubmit={save}>
          <input
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={change}
          />
          <input
            name="age"
            type="number"
            placeholder="Age"
            value={form.age}
            onChange={change}
          />
          <input
            name="city"
            placeholder="City"
            value={form.city}
            onChange={change}
          />
          <textarea
            name="bio"
            rows={3}
            placeholder="Bio"
            value={form.bio}
            onChange={change}
          />
          <button type="submit">Save</button>
          {profile && (
            <button
              type="button"
              className="secondary"
              onClick={() => setEditing(false)}
            >
              Cancel
            </button>
          )}
          {error && <p className="error">{error}</p>}
        </form>
      </div>
    );
  }

  // profile view
  return (
    <div className="card">
      <div className="profile-head">
        <div className="avatar-lg">{profile.username[0].toUpperCase()}</div>
        <div>
          <h3 style={{ marginBottom: 2 }}>{profile.username}</h3>
          <div className="when">
            User #{profile.user_id}
            {profile.age && ` · ${profile.age}`}
            {profile.city && ` · ${profile.city}`}
          </div>
        </div>
      </div>
      {profile.bio && <p>{profile.bio}</p>}
      <button className="secondary" onClick={startEdit}>
        Edit profile
      </button>
    </div>
  );
}
