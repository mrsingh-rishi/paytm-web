const express = require("express");

const router = express.Router();

router.post("/login", (req, res) => {
  res.send("Working");
});
router.post("/signup", (req, res) => {
  res.send("Working");
});
router.patch("/:id", (req, res) => {
  res.send("Working");
});

module.exports = router;
