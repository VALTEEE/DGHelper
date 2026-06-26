const express = require("express");
const cors = require("cors");

const discsRoute = require("./routes/discsRoute");
const authRoute = require("./routes/authRoute");
const bagRoute = require("./routes/bagRoute");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.use("/discs", discsRoute);
app.use("/auth", authRoute);
app.use("/bag", bagRoute);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});