// Imports

const express = require("express");

const { authMiddleware } = require("../middleware");
const {
  updateUser,
  getUserByFilter,
  login,
  singup,
  getUserData,
  getAllUsers,
} = require("../controllers/user");

// Router
const router = express.Router();

// Login

router.post("/login", login);

// Singup or Create User

router.post("/signup", singup);

// Update User

router.patch("/", authMiddleware, updateUser);

// Get user buy filter

router.get("/bulk", authMiddleware, getUserByFilter);

// Get user data

router.get("/", authMiddleware, getUserData);

// Get all users

router.get("/all", authMiddleware, getAllUsers);

module.exports = router;
