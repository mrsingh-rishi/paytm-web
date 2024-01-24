const express = require("express");
const { authMiddleware } = require("../middleware");
const { getBalance, transferFunds } = require("../controllers/account");
const router = express.Router();

router.get("/balance", authMiddleware, getBalance);

router.post("/transfer", authMiddleware, transferFunds);

module.exports = router;
