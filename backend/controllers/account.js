const { Account } = require("../db");
const zod = require("zod");
const { default: mongoose } = require("mongoose");
const transactionBody = zod.object({
  to: zod.string(),
  amount: zod.number(),
});

async function getBalance(req, res) {
  try {
    const userId = req.userId;
    const account = await Account.findOne({ userId: userId });
    if (!account) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ balance: account.balance });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
}

async function transferFunds(req, res) {
  try {
    const { success } = transactionBody.safeParse(req.body);
    if (!success) {
      return res.status(400).json({ message: "Invalid Input" });
    }

    const session = await mongoose.startSession();

    session.startTransaction();
    const { amount, to } = req.body;

    // Fetch the accounts within the transaction
    const account = await Account.findOne({ userId: req.userId }).session(
      session
    );

    if (!account || account.balance < amount) {
      await session.abortTransaction();
      return res.status(400).json({
        message: "Insufficient balance",
      });
    }

    const toAccount = await Account.findOne({ userId: to }).session(session);

    if (!toAccount) {
      await session.abortTransaction();
      return res.status(400).json({
        message: "Invalid account",
      });
    }

    // Perform the transfer
    await Account.updateOne(
      { userId: req.userId },
      { $inc: { balance: -amount } }
    ).session(session);
    await Account.updateOne(
      { userId: to },
      { $inc: { balance: amount } }
    ).session(session);

    // Commit the transaction
    await session.commitTransaction();

    res.json({
      message: "Transfer successful",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json("Something went wrong");
  }
}

module.exports = {
  getBalance,
  transferFunds,
};
