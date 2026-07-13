const express = require("express");
const cors = require("cors");

const authRoute = require("./routes/authRoute");
const bagRoute = require("./routes/bagRoute");
const profileRoute = require("./routes/profileRoute");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.use("/auth", authRoute);
app.use("/bag", bagRoute);
app.use("/profile", profileRoute);

app.get("/api/discs", async (req, res) => {
  try {
    const response = await fetch("https://discit-api.fly.dev/disc");
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const discs = await response.json();
    const simplifiedDiscs = discs.map((disc) => ({
      name: disc.name,
      brand: disc.brand,
      category: disc.category,
      speed: disc.speed,
      glide: disc.glide,
      turn: disc.turn,
      fade: disc.fade,
      stability: disc.stability,
    }));

    res.json(simplifiedDiscs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch discs." });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});