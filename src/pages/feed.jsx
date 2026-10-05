import { useState, useEffect } from "react";
import { useAuth } from "../context/login";

export default function Feed() {
  const { api, me } = useAuth();
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
    if (!title.trim() && !content.trim()) return;
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
    async function init() {
      const { res, data } = await api("/posts");
      if (res.ok) setPosts(data);
    }
    init();
  }, []);

  return (
    <>
      <form className="card composer" onSubmit={createPost}>
        <input
          name="title"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          name="content"
          rows={3}
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <div className="composer-actions">
          <select
            name="visibility"
            value={visibility}
            onChange={(e) => setVisibility(e.target.value)}
          >
            <option>Public</option>
            <option>Friends-Only</option>
            <option>Private</option>
          </select>
          <button type="submit">Post</button>
        </div>
      </form>

      {posts.length === 0 && (
        <p className="empty">Nothing here yet. Say something!</p>
      )}

      {posts.map((p) => (
        <article className="card post" key={p.post_id}>
          <div className="post-head">
            <div className="avatar">{(p.username || "U")[0].toUpperCase()}</div>
            <div>
              <div className="who">{p.username || `User #${p.user_id}`}</div>
              <div className="when">
                {new Date(p.created_at).toLocaleDateString(undefined, {
                  day: "numeric",
                  month: "short",
                })}
              </div>
            </div>
            <span className="badge">{p.visibility}</span>
          </div>

          {p.title && <h3>{p.title}</h3>}
          <p>{p.content}</p>

          {(me?.user_id === p.user_id || me?.role === "admin") && (
            <button className="link" onClick={() => deletePost(p.post_id)}>
              Delete
            </button>
          )}
        </article>
      ))}
    </>
  );
}
