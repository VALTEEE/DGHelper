const express = require("express");
const cors = require("cors");

const discsRoute = require("./routes/discsRoute"); // your route file

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Mount the discs route at /discs
app.use("/discs", discsRoute);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});