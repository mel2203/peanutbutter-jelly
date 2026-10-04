import { useState, useEffect } from "react";
import { useAuth } from "../context/login";

export default function Feed() {
  const { api } = useAuth();
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [visibility, setVisibility] = useState("Public");

  async function loadPosts() {
    const { res, data } = await api("/posts");
    if (res.ok) setPosts(data);
  }

  async function createPost(e) {
    e.preventDefault();
    const { res } = await api("/posts", {
      method: "POST",
      body: JSON.stringify({ title, content, visibility }),
    });
    if (res.ok) {
      setTitle("");
      setContent("");
      loadPosts();
    }
  }

  async function deletePost(id) {
    await api(`/posts/${id}`, { method: "DELETE" });
    loadPosts();
  }

  useEffect(() => {
    loadPosts();
  }, []);

  return (
    <>
      <div className="card">
        <form onSubmit={createPost}>
          <input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            rows={3}
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <select
            value={visibility}
            onChange={(e) => setVisibility(e.target.value)}
          >
            <option>Public</option>
            <option>Friends-Only</option>
            <option>Private</option>
          </select>
          <button type="submit">Spread it! 🍓</button>
        </form>
      </div>

      {posts.length === 0 && (
        <p className="switch">No posts yet. Be the first to share!</p>
      )}

      {posts.map((p) => (
        <div className="card" key={p.post_id}>
          <strong>{p.title}</strong>
          <span className="badge">{p.visibility}</span>
          <p>{p.content}</p>
          <button className="secondary" onClick={() => deletePost(p.post_id)}>
            Delete
          </button>
        </div>
      ))}
    </>
  );
}
