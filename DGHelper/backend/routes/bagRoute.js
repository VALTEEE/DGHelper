const express = require("express");
const router = express.Router();
const { getBag, saveBag } = require("../controllers/bagController");
const { authMiddleware } = require("../middleware/auth");

router.get("/", authMiddleware, getBag);
router.put("/", authMiddleware, saveBag);

module.exports = router;
