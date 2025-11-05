import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API_URL = "https://post-api-4qzj.onrender.com/api/posts";

function App() {
  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState({ author: "", content: "", imageUrl: "" });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  function fetchPosts() {
    axios.get(API_URL)
      .then(res => setPosts(res.data.reverse()))
      .catch(console.error);
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.author.trim() || !form.content.trim()) return;
    if (editingId) {
      axios.put(`${API_URL}/${editingId}`, form)
        .then(() => {
          setForm({ author: "", content: "", imageUrl: "" });
          setEditingId(null);
          fetchPosts();
        })
        .catch(console.error);
    } else {
      axios.post(API_URL, form)
        .then(() => {
          setForm({ author: "", content: "", imageUrl: "" });
          fetchPosts();
        })
        .catch(console.error);
    }
  }

  function handleEdit(post) {
    setForm({
      author: post.author,
      content: post.content,
      imageUrl: post.imageUrl || "",
    });
    setEditingId(post.id);
  }

  function handleCancelEdit() {
    setForm({ author: "", content: "", imageUrl: "" });
    setEditingId(null);
  }

  function handleDelete(id) {
    if (window.confirm("Are you sure you want to delete this post?")) {
      axios.delete(`${API_URL}/${id}`)
        .then(() => fetchPosts())
        .catch(console.error);
    }
  }

  return (
    <div className="lux-container">
      <div className="lux-card lux-form-card">
        <h1 className="lux-title">Facebook Posts</h1>
        <form className="lux-post-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="author"
            className="lux-input"
            placeholder="Your Name"
            value={form.author}
            onChange={handleChange}
            required
            autoFocus
            disabled={!!editingId}
          />
          <textarea
            name="content"
            className="lux-input lux-textarea"
            placeholder="What's on your mind?"
            value={form.content}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="imageUrl"
            className="lux-input"
            placeholder="Image URL (optional)"
            value={form.imageUrl}
            onChange={handleChange}
          />
          <div style={{display: 'flex', gap: '10px'}}>
            <button type="submit" className="lux-btn lux-post-btn">
              {editingId ? "Update Post" : "Post"}
            </button>
            {editingId && (
              <button type="button" className="lux-btn lux-cancel-btn" onClick={handleCancelEdit}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
      <div className="lux-feed">
        {posts.length === 0 && (
          <div className="lux-card lux-empty">No posts yet.</div>
        )}
        {posts.map(post => (
          <div key={post.id} className="lux-card lux-post-card">
            <div className="lux-post-header">
              <div className="lux-author">
                <div className="lux-avatar">
                  {post.author ? post.author[0].toUpperCase() : "?"}
                </div>
                <span className="lux-author-name">{post.author}</span>
              </div>
              <span className="lux-date">
                {new Date(post.createdDate).toLocaleString()}
              </span>
            </div>
            <div className="lux-post-content">{post.content}</div>
            {post.imageUrl && (
              <div className="lux-post-image-wrap">
                <img src={post.imageUrl} alt="post" className="lux-post-image" />
              </div>
            )}
            <div className="lux-post-actions">
              <button className="lux-action-btn" onClick={() => handleEdit(post)}>Edit</button>
              <button className="lux-action-btn" onClick={() => handleDelete(post.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;