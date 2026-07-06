const express = require("express");
const cors = require("cors");

const authRoute = require("./routes/authRoute");
const bagRoute = require("./routes/bagRoute");
const profileRoute = require("./routes/profileRoute");   // ← add this line

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.use("/auth", authRoute);
app.use("/bag", bagRoute);
app.use("/profile", profileRoute);                       // ← add this line

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});