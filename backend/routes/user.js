const express = require("express");
const { User } = require("../db");
const zod = require("zod");
const { JWT_SCECRET_KEY } = require("../config");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { authMiddleware } = require("../middleware");
const bcrypt = require("bcrypt");

const singupZod = zod.object({
  username: zod.string().email(),
  firstName: zod.string(),
  lastName: zod.string(),
  password: zod.string(),
});
// Zod Update Body
const updateBody = zod.object({
  password: zod.string().optional(),
  firstName: zod.string().optional(),
  lastName: zod.string().optional(),
});

const loginBody = zod.object({
  username: zod.string().email(),
  password: zod.string(),
});
// Login

router.post("/login", async (req, res) => {
  try {
    // const { success } = loginBody.safeParse(req.body);
    // if (!success) {
    //   return res.status(411).json({
    //     message: "Incorrect inputs",
    //   });
    // }
    // const user = await User.findOne({ username: req.body.username });
    // const userId = user.id;
    // const saltRounds = 10;
    // const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
    // bcrypt.compare(user.password, hashedPassword, (err, data) => {
    //   if (err) {
    //     return res.status(400).json({ message: "Something went wrong" });
    //   }
    //   console.log(data);
    //   if (data) {
    //     const token = jwt.sign({ userId }, JWT_SCECRET_KEY);
    //     return res.status(200).json({ message: "Login Sucessfull", token });
    //   } else {
    //     return res
    //       .status(400)
    //       .json({ message: "Password doesn't match", user });
    //   }
    // });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
});

// Singup or Create User

router.post("/signup", async (req, res) => {
  try {
    const { success } = singupZod.safeParse(req.body);
    if (!success) {
      return res.status(411).json({
        message: "Email already taken / Incorrect inputs",
      });
    }

    // Checking existing User

    const existingUser = await User.findOne({ username: req.body.username });
    if (existingUser) {
      return res.status(411).json({
        message: "Email already taken / Incorrect inputs",
      });
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
    const user = await User.create({
      username: req.body.username,
      password: hashedPassword,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
    });

    const userId = user._id;
    const token = jwt.sign({ userId }, JWT_SCECRET_KEY);

    res.status(200).json({ message: "User Created", token });
  } catch (error) {
    console.log(error);
  }
});

// Update User

router.patch("/", authMiddleware, async (req, res) => {
  try {
    const { success } = updateBody.safeParse(req.body);

    if (!success) {
      return res.status(411).json({
        message: "Error while updating information",
      });
    }

    const filter = { id: req.userId };
    const update = req.body;

    if (req.body.password) {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
      update.password = hashedPassword;
    }
    await User.updateOne(filter, { $set: update });
    res.json({ message: "User Updated" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/bulk", authMiddleware, async (req, res) => {
  const { filter } = req.query;
  const regex = new RegExp(filter, "i");
  const users = await User.find({
    $or: [{ firstName: { $regex: regex } }, { lastName: { $regex: regex } }],
  });
  res.json(users);
});

module.exports = router;
