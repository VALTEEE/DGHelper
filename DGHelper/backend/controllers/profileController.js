const bcrypt = require("bcryptjs");
const db = require("../database/db");

function getProfile(req, res) {
  const user = db
    .prepare("SELECT id, email, username, throw_distance FROM users WHERE id = ?")
    .get(req.user.id);

  if (!user) return res.status(404).json({ error: "User not found" });

  res.json({ user });
}

function updateProfile(req, res) {
  const { username, throwDistance } = req.body;
  const userId = req.user.id;

  if (username !== undefined) {
    const trimmed = username.trim();
    if (trimmed.length < 2) {
      return res.status(400).json({ error: "Username must be at least 2 characters" });
    }
    db.prepare("UPDATE users SET username = ? WHERE id = ?").run(trimmed, userId);
  }

  if (throwDistance !== undefined) {
    const dist = Number(throwDistance);
    if (isNaN(dist) || dist < 0 || dist > 300) {
      return res.status(400).json({ error: "Throw distance must be between 0 and 300 meters" });
    }
    db.prepare("UPDATE users SET throw_distance = ? WHERE id = ?").run(dist, userId);
  }

  const updated = db
    .prepare("SELECT id, email, username, throw_distance FROM users WHERE id = ?")
    .get(userId);

  res.json({ user: updated });
}

function changePassword(req, res) {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: "Both current and new password are required" });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ error: "New password must be at least 6 characters" });
  }

  const user = db
    .prepare("SELECT password_hash FROM users WHERE id = ?")
    .get(req.user.id);

  if (!bcrypt.compareSync(currentPassword, user.password_hash)) {
    return res.status(401).json({ error: "Current password is incorrect" });
  }

  const newHash = bcrypt.hashSync(newPassword, 10);
  db.prepare("UPDATE users SET password_hash = ? WHERE id = ?").run(newHash, req.user.id);

  res.json({ message: "Password changed successfully" });
}

module.exports = { getProfile, updateProfile, changePassword };