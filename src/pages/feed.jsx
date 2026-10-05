import { useState, useEffect } from "react";
import { useAuth } from "../context/login";

export default function Feed() {
  const { api, me, profile } = useAuth();
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [visibility, setVisibility] = useState("Public");
  const initial = (profile?.username || "Y")[0].toUpperCase();
  const [imageUrl, setImageUrl] = useState("");

  async function loadPosts() {
    const { res, data } = await api("/posts");
    if (res.ok) setPosts(data);
  }

  async function createPost(e) {
    e.preventDefault();
    if (!title.trim() && !content.trim() && !imageUrl.trim()) return;
    const { res } = await api("/posts", {
      method: "POST",
      body: JSON.stringify({
        title,
        content,
        visibility,
        image_url: imageUrl || null,
      }),
    });
    if (res.ok) {
      setTitle("");
      setContent("");
      setImageUrl("");
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
      <form className="pb-composer" onSubmit={createPost}>
        <div className="pb-composer-head">
          <div className="pb-avatar">{initial}</div>
          <div className="pb-composer-text">
            <strong>Share a little something</strong>
          </div>
          <span className="pb-spark">✳</span>
        </div>

        <input
          name="title"
          placeholder="Give your post a title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          name="content"
          rows={4}
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <input
          name="image_url"
          type="url"
          placeholder="Add a picture link (optional)"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />

        {imageUrl && (
          <img
            className="pb-preview"
            src={imageUrl}
            alt="Preview"
            onError={(e) => (e.currentTarget.style.display = "none")}
            onLoad={(e) => (e.currentTarget.style.display = "block")}
          />
        )}

        <div className="pb-composer-foot">
          <select
            name="visibility"
            value={visibility}
            onChange={(e) => setVisibility(e.target.value)}
          >
            <option>Public</option>
            <option>Friends-Only</option>
            <option>Private</option>
          </select>

          <button type="submit" className="pb-primary">
            Spread it
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 21s-7.5-4.7-9.5-9.6A5.2 5.2 0 0112 7.3a5.2 5.2 0 019.5 4.1C19.5 16.3 12 21 12 21z" />
            </svg>
          </button>
        </div>
      </form>

      {posts.length === 0 && (
        <p className="empty">Nothing here yet. Say something!</p>
      )}

      {posts.map((p) => (
        <article className="card post" key={p.post_id}>
          <div className="post-head">
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
          {p.image_url && (
            <img className="pb-post-img" src={p.image_url} alt="" />
          )}

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
