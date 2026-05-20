const express = require("express");
const router = express.Router();
const { getAllDiscs } = require("../controllers/discController");

// GET /discs?page=1&brand=Innova&speed=12
router.get("/", getAllDiscs);

module.exports = router;