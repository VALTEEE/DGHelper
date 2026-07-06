import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { fetchProfile, updateProfile, changePassword } from "../utils/api";

export default function Profile() {
  const { user, updateUser } = useAuth();

  const [username, setUsername] = useState("");
  const [throwDistance, setThrowDistance] = useState(0);
  const [profileMsg, setProfileMsg] = useState("");
  const [profileError, setProfileError] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMsg, setPasswordMsg] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);

  // Load current profile data
  useEffect(() => {
    fetchProfile()
      .then((data) => {
        setUsername(data.user.username || "");
        setThrowDistance(data.user.throw_distance || 0);
      })
      .catch(() => {});
  }, []);

  async function handleSaveProfile(e) {
    e.preventDefault();
    setProfileMsg("");
    setProfileError("");
    setSavingProfile(true);
    try {
      const data = await updateProfile(username, throwDistance);
      updateUser({
        username: data.user.username,
        throw_distance: data.user.throw_distance,
      });
      setProfileMsg("Profile saved!");
    } catch (err) {
      setProfileError(err.message);
    } finally {
      setSavingProfile(false);
    }
  }

  async function handleChangePassword(e) {
    e.preventDefault();
    setPasswordMsg("");
    setPasswordError("");

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    setSavingPassword(true);
    try {
      await changePassword(currentPassword, newPassword);
      setPasswordMsg("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setPasswordError(err.message);
    } finally {
      setSavingPassword(false);
    }
  }

  if (!user) {
    return <p style={{ padding: "2rem" }}>You need to be logged in to view your profile.</p>;
  }

  return (
    <div className="profile-page">
      <h1>Your Profile</h1>
      <p className="profile-email">Signed in as <strong>{user.email}</strong></p>

      {/* ── Profile settings ── */}
      <section className="profile-card">
        <h2>Profile settings</h2>
        <form onSubmit={handleSaveProfile} className="profile-form">

          <label className="profile-field">
            <span className="profile-field-label">Username</span>
            <span className="profile-field-hint">How your name appears in the app</span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. DiscKing92"
              minLength={2}
            />
          </label>

          <label className="profile-field">
            <span className="profile-field-label">How far can you throw? (meters)</span>
            <span className="profile-field-hint">
              Your average max throw with a driver — used to recommend discs and explain throws on the map
            </span>
            <div className="throw-input-row">
              <input
                type="range"
                min={20}
                max={200}
                step={5}
                value={throwDistance}
                onChange={(e) => setThrowDistance(Number(e.target.value))}
                className="throw-slider"
              />
              <span className="throw-value">{throwDistance} m</span>
            </div>
            <div className="throw-labels">
              <span>20 m (beginner)</span>
              <span>110 m (intermediate)</span>
              <span>200 m+ (advanced)</span>
            </div>
          </label>

          {profileMsg && <p className="profile-success">{profileMsg}</p>}
          {profileError && <p className="profile-error">{profileError}</p>}

          <button type="submit" className="profile-save-btn" disabled={savingProfile}>
            {savingProfile ? "Saving..." : "Save profile"}
          </button>
        </form>
      </section>

      {/* ── Change password ── */}
      <section className="profile-card">
        <h2>Change password</h2>
        <form onSubmit={handleChangePassword} className="profile-form">

          <label className="profile-field">
            <span className="profile-field-label">Current password</span>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </label>

          <label className="profile-field">
            <span className="profile-field-label">New password</span>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={6}
              autoComplete="new-password"
            />
          </label>

          <label className="profile-field">
            <span className="profile-field-label">Confirm new password</span>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              autoComplete="new-password"
            />
          </label>

          {passwordMsg && <p className="profile-success">{passwordMsg}</p>}
          {passwordError && <p className="profile-error">{passwordError}</p>}

          <button type="submit" className="profile-save-btn" disabled={savingPassword}>
            {savingPassword ? "Changing..." : "Change password"}
          </button>
        </form>
      </section>
    </div>
  );
}