import React, { useState, useEffect } from "react";

const API = "http://localhost:5000/api";

export default function App() {
  const [token, setToken] = useState(() => localStorage.getItem("loop_token") || "");
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [text, setText] = useState("");
  const [items, setItems] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) return;
    loadFeedback();
  }, [token]);

  async function auth() {
    const endpoint = mode === "login" ? "login" : "register";

    try {
      const r = await fetch(`${API}/auth/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const data = await r.json();

      if (!r.ok) {
        setMessage(data.message || "Authentication failed");
        return;
      }

      if (mode === "register") {
        setMode("login");
        setMessage("Registered successfully. Please login.");
        setForm({ name: "", email: "", password: "" });
        return;
      }

      localStorage.setItem("loop_token", data.token);
      setToken(data.token);
      setMessage("");
    } catch (error) {
      setMessage("Unable to connect to the server.");
    }
  }

  async function loadFeedback() {
    if (!token) return;

    try {
      const r = await fetch(`${API}/feedback`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await r.json();

      if (!r.ok) {
        setMessage(data.message || "Failed to load feedback");
        return;
      }

      setItems(data);
      setMessage("");
    } catch (error) {
      setMessage("Unable to load feedback.");
    }
  }

  async function addFeedback() {
    if (!text.trim()) {
      setMessage("Please enter feedback before saving.");
      return;
    }

    try {
      const r = await fetch(`${API}/feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ text })
      });

      const data = await r.json();

      if (!r.ok) {
        setMessage(data.message || "Failed to save feedback");
        return;
      }

      setText("");
      setMessage("Feedback saved.");
      await loadFeedback();
    } catch (error) {
      setMessage("Unable to save feedback.");
    }
  }

  async function analyze(id) {
    setMessage("Analyzing with AI...");

    try {
      const r = await fetch(`${API}/feedback/${id}/analyze`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await r.json();

      if (!r.ok) {
        setMessage(data.message || "Analysis failed");
        return;
      }

      setMessage("AI analysis completed.");
      await loadFeedback();
    } catch (error) {
      setMessage("Unable to analyze feedback.");
    }
  }

  function logout() {
    localStorage.removeItem("loop_token");
    setToken("");
    setItems([]);
    setMessage("Logged out successfully.");
  }

  if (!token) {
    return (
      <main className="auth">
        <section className="card">
          <h1>LOOP</h1>
          <p>AI-Powered Customer Feedback Intelligence</p>

          {mode === "register" && (
            <input
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          )}

          <input
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <button onClick={auth}>{mode === "login" ? "Login" : "Create account"}</button>

          <button
            className="link"
            onClick={() => setMode(mode === "login" ? "register" : "login")}
          >
            {mode === "login" ? "Create account" : "Back to login"}
          </button>

          <small>{message}</small>
        </section>
      </main>
    );
  }

  return (
    <main>
      <header>
        <h1>LOOP</h1>
        <button onClick={logout}>Logout</button>
      </header>

      <section className="card">
        <h2>Add Customer Feedback</h2>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter customer feedback..."
        />
        <button onClick={addFeedback}>Save Feedback</button>
      </section>

      <section className="card">
        <div className="row">
          <h2>Feedback Intelligence</h2>
          <button onClick={loadFeedback}>Refresh</button>
        </div>

        {items.map((item) => (
          <article className="feedback" key={item._id}>
            <p>{item.text}</p>

            <div className="tags">
              <span>{item.sentiment || "Not analyzed"}</span>
              {item.category && <span>{item.category}</span>}
              {item.priority && <span>{item.priority}</span>}
            </div>

            {item.summary && (
              <p>
                <b>Summary:</b> {item.summary}
              </p>
            )}

            {item.recommendation && (
              <p>
                <b>Action:</b> {item.recommendation}
              </p>
            )}

            <button onClick={() => analyze(item._id)}>Analyze with AI</button>
          </article>
        ))}
      </section>
    </main>
  );
}
