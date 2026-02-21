import { useState } from "react";

const initial = {
  username: "",
  email: "",
  password: "",
  role: "user",
};

export default function AuthPanel({ onLogin, loading }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState(initial);

  function update(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function submit(event) {
    event.preventDefault();
    await onLogin(mode, form);
  }

  return (
    <section className="auth-card fade-up">
      <div className="auth-head">
        <p className="eyebrow">Vibely</p>
        <h1>Feel every beat.</h1>
        <p>Sign in to stream tracks, or join as an artist to upload your own sound.</p>
      </div>

      <div className="auth-switch">
        <button
          className={mode === "login" ? "active" : ""}
          type="button"
          onClick={() => setMode("login")}
        >
          Login
        </button>
        <button
          className={mode === "register" ? "active" : ""}
          type="button"
          onClick={() => setMode("register")}
        >
          Register
        </button>
      </div>

      <form onSubmit={submit} className="auth-form">
        {mode === "register" && (
          <label>
            Username
            <input
              value={form.username}
              onChange={(e) => update("username", e.target.value)}
              placeholder="your name"
              required
            />
          </label>
        )}

        <label>
          Email {mode === "login" ? "(optional)" : ""}
          <input
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder="you@example.com"
            type="email"
            required={mode === "register"}
          />
        </label>

        {mode === "login" && (
          <label>
            Username (optional)
            <input
              value={form.username}
              onChange={(e) => update("username", e.target.value)}
              placeholder="use email or username"
            />
          </label>
        )}

        <label>
          Password
          <input
            value={form.password}
            onChange={(e) => update("password", e.target.value)}
            type="password"
            placeholder="••••••••"
            required
          />
        </label>

        {mode === "register" && (
          <label>
            Role
            <select value={form.role} onChange={(e) => update("role", e.target.value)}>
              <option value="user">Listener</option>
              <option value="artist">Artist</option>
            </select>
          </label>
        )}

        <button className="btn-primary" type="submit" disabled={loading}>
          {loading ? "Please wait..." : mode === "login" ? "Enter Vibely" : "Create account"}
        </button>
      </form>
    </section>
  );
}
