import { useState, useEffect } from "react";
import { useAuth } from "../context/login";

export default function Friends() {
  const { api } = useAuth();
  const [friends, setFriends] = useState([]);
  const [requests, setRequests] = useState([]);
  const [friendId, setFriendId] = useState("");
  const [message, setMessage] = useState("");

  async function load() {
    const f = await api("/friends");
    const r = await api("/friend/requests");
    if (f.res.ok) setFriends(f.data);
    if (r.res.ok) setRequests(r.data);
  }

  async function sendRequest(e) {
    e.preventDefault();
    const { data } = await api("/friend", {
      method: "POST",
      body: JSON.stringify({ friend_id: friendId }),
    });
    setMessage(data.message || data.error);
    setFriendId("");
    load();
  }

  async function accept(id) {
    await api("/friend/accept", {
      method: "PATCH",
      body: JSON.stringify({ friend_id: id }),
    });
    load();
  }

  async function remove(id) {
    await api(`/friend/${id}`, { method: "DELETE" });
    load();
  }

  useEffect(() => {
    load();
  }, []);

  const name = (u) => u.username || `User #${u.user_id}`;

  return (
    <>
      <div className="card">
        <h3 style={{ marginTop: 0 }}>Add a friend</h3>
        <form onSubmit={sendRequest}>
          <input
            placeholder="Their user ID"
            value={friendId}
            onChange={(e) => setFriendId(e.target.value)}
          />
          <button type="submit">Send request 💌</button>
        </form>
        {message && <p className="switch">{message}</p>}
      </div>

      <h3>Requests</h3>
      {requests.length === 0 && <p className="switch">No pending requests.</p>}
      {requests.map((u) => (
        <div className="card row" key={u.user_id}>
          <span>{name(u)}</span>
          <span>
            <button onClick={() => accept(u.user_id)}>Accept</button>{" "}
            <button className="secondary" onClick={() => remove(u.user_id)}>
              Reject
            </button>
          </span>
        </div>
      ))}

      <h3>My friends</h3>
      {friends.length === 0 && <p className="switch">No friends yet.</p>}
      {friends.map((u) => (
        <div className="card row" key={u.user_id}>
          <span>
            {name(u)}
            {u.city && <span className="badge">{u.city}</span>}
          </span>
          <button className="secondary" onClick={() => remove(u.user_id)}>
            Unfriend
          </button>
        </div>
      ))}
    </>
  );
}
