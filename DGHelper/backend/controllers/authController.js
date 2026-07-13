const db = require("../database/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../middleware/auth");

function createToken(user) {
  return jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: "7d",
  });
}

function register(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters" });
  }

  const normalizedEmail = email.trim().toLowerCase();

  try {
    const passwordHash = bcrypt.hashSync(password, 10);

    const result = db
      .prepare("INSERT INTO users (email, password_hash) VALUES (?, ?)")
      .run(normalizedEmail, passwordHash);

    const userId = result.lastInsertRowid;

    db.prepare(
      "INSERT INTO user_bags (user_id, owned_discs, bags) VALUES (?, '[]', '[]')"
    ).run(userId);

    const user = { id: userId, email: normalizedEmail };
    const token = createToken(user);

    res.status(201).json({ token, user });
  } catch (err) {
    if (err.code === "SQLITE_CONSTRAINT_UNIQUE") {
      return res.status(409).json({ error: "An account with this email already exists" });
    }
    console.error(err);
    res.status(500).json({ error: "Registration failed" });
  }
}

function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const normalizedEmail = email.trim().toLowerCase();

  const user = db
    .prepare("SELECT id, email, password_hash FROM users WHERE email = ?")
    .get(normalizedEmail);

  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const token = createToken({ id: user.id, email: user.email });

  res.json({
    token,
    user: { id: user.id, email: user.email },
  });
}

function me(req, res) {
  const user = db
    .prepare("SELECT id, email, username, throw_distance, throw_handedness FROM users WHERE id = ?")
    .get(req.user.id);

  if (!user) return res.status(404).json({ error: "User not found" });

  res.json({ user });
}

module.exports = { register, login, me };
