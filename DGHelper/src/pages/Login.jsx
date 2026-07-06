import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login({ onClose }) {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const isModal = !!onClose;

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginSubmitting, setLoginSubmitting] = useState(false);

  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regError, setRegError] = useState("");
  const [regSubmitting, setRegSubmitting] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setLoginError("");
    setLoginSubmitting(true);
    try {
      await login(loginEmail, loginPassword);
      if (isModal) onClose();
      else navigate("/your-bag");
    } catch (err) {
      setLoginError(err.message);
    } finally {
      setLoginSubmitting(false);
    }
  }

  async function handleRegister(e) {
    e.preventDefault();
    setRegError("");
    setRegSubmitting(true);
    try {
      await register(regEmail, regPassword);
      if (isModal) onClose();
      else navigate("/your-bag");
    } catch (err) {
      setRegError(err.message);
    } finally {
      setRegSubmitting(false);
    }
  }

  const content = (
    <div className="login-modal-card">
      {isModal && (
        <button type="button" className="login-close-btn" onClick={onClose}>✕</button>
      )}
      <h2 className="login-modal-title">Welcome</h2>
      <p className="login-subtitle">Sign in or create an account to save your bag.</p>

      <div className="login-dual-grid">

        {/* LEFT — Log in */}
        <div className="login-panel">
          <h3>Log in</h3>
          <form onSubmit={handleLogin} className="login-form">
            <label className="login-field">
              <span className="login-field-label">Email / Username</span>
              <input
                type="text"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </label>
            <label className="login-field">
              <span className="login-field-label">Password</span>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
                minLength={6}
                autoComplete="current-password"
              />
            </label>
            {loginError && <p className="login-error">{loginError}</p>}
            <button type="submit" className="login-submit" disabled={loginSubmitting}>
              {loginSubmitting ? "Logging in..." : "Log in"}
            </button>
          </form>
        </div>

        {/* RIGHT — Register */}
        <div className="login-panel">
          <h3>Create account</h3>
          <form onSubmit={handleRegister} className="login-form">
            <label className="login-field">
              <span className="login-field-label">Email / Username</span>
              <input
                type="text"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </label>
            <label className="login-field">
              <span className="login-field-label">Password</span>
              <input
                type="password"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                required
                minLength={6}
                autoComplete="new-password"
              />
            </label>
            {regError && <p className="login-error">{regError}</p>}
            <button type="submit" className="login-submit" disabled={regSubmitting}>
              {regSubmitting ? "Creating..." : "Create account"}
            </button>
          </form>
        </div>

      </div>

      {!isModal && (
        <p className="login-footer">
          <Link to="/your-bag">Continue without an account</Link>
        </p>
      )}
    </div>
  );

  if (isModal) {
    return (
      <div className="login-modal-backdrop" onClick={onClose}>
        <div onClick={(e) => e.stopPropagation()}>
          {content}
        </div>
      </div>
    );
  }

  return <div className="login-page">{content}</div>;
}