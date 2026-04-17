import { useState, useEffect } from "react";
import "./App.css";

const API_BASE = "http://localhost:5000";

function App() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/messages`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setMessages(data.messages || []);
    } catch (err) {
      setError("Could not connect to the server. Is Flask running?");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append("new_message", newMessage.trim());
      const res = await fetch(`${API_BASE}/submit`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Submit failed");
      const data = await res.json();
      setMessages((prev) => [data.message, ...prev]);
      setNewMessage("");
    } catch (err) {
      setError("Failed to submit message. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="app">
      <header className="header">
        <h1>Message Board</h1>
        <p className="subtitle">Two-Tier Flask + MySQL + React</p>
      </header>

      <main className="main">
        <section className="card form-card">
          <h2>Post a Message</h2>
          <form onSubmit={handleSubmit} className="form">
            <input
              type="text"
              className="input"
              placeholder="Type your message here..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              disabled={submitting}
              maxLength={500}
            />
            <button type="submit" className="btn" disabled={submitting || !newMessage.trim()}>
              {submitting ? "Posting..." : "Post Message"}
            </button>
          </form>
        </section>

        {error && (
          <div className="error-banner">
            {error}
            <button onClick={() => setError(null)} className="error-close">x</button>
          </div>
        )}

        <section className="card messages-card">
          <div className="messages-header">
            <h2>Messages</h2>
            <button onClick={fetchMessages} className="btn-refresh" disabled={loading}>
              {loading ? "Loading..." : "Refresh"}
            </button>
          </div>

          {loading ? (
            <div className="loading"><p>Loading messages...</p></div>
          ) : messages.length === 0 ? (
            <div className="empty-state"><p>No messages yet. Be the first to post!</p></div>
          ) : (
            <ul className="messages-list">
              {messages.map((msg, idx) => (
                <li key={idx} className="message-item">
                  <span className="message-index">#{idx + 1}</span>
                  <span className="message-text">{msg}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>

      <footer className="footer">
        <p>Deployed on AWS EC2 · Dockerized · CI/CD via Jenkins</p>
      </footer>
    </div>
  );
}

export default App;
