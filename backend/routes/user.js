// Imports

const express = require("express");

const { authMiddleware } = require("../middleware");
const { updateUser, getUserByFilter, login } = require("../controllers/user");
const { sign } = require("jsonwebtoken");

// Router
const router = express.Router();

// Login

router.post("/login", login);

// Singup or Create User

router.post("/signup", sign);

// Update User

router.patch("/", authMiddleware, updateUser);

// Get user buy filter

router.get("/bulk", authMiddleware, getUserByFilter);

module.exports = router;
