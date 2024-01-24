const { User, Account } = require("../db");
const zod = require("zod");
const { JWT_SCECRET_KEY } = require("../config");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// Zod Schemas

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

async function login(req, res) {
  try {
    const { success } = loginBody.safeParse(req.body);
    if (!success) {
      return res.status(411).json({
        message: "Incorrect inputs",
      });
    }
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      return res.status(403).json({ message: "Wrong  or User not found" });
    }
    const userId = user.id;
    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(403).json({
        message: "Wrong credentials",
        hashedPassword,
        password: user.password,
      });
    }

    const token = jwt.sign({ userId }, JWT_SCECRET_KEY);
    res.status(200).json({ message: "Login Sucessfully", token });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
}

async function singup(req, res) {
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
    await Account.create({
      userId: userId,
      balance: 1 + Math.random() * 10000,
    });

    const token = jwt.sign({ userId }, JWT_SCECRET_KEY);

    res.status(200).json({ message: "User Created", token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
}

async function updateUser(req, res) {
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
}

async function getUserByFilter(req, res) {
  try {
    const filter = req.query.filter || "";
    const users = await User.find({
      $or: [
        { firstName: { $regex: filter } },
        { lastName: { $regex: filter } },
      ],
    });

    if (!users || users.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: "Somthing wen wrong" });
  }
}

module.exports = {
  updateUser,
  login,
  singup,
  getUserByFilter
};
