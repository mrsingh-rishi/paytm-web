const express = require("express");
const rootRouter = require("./routes/index");
const { connectToDB } = require("./db");

const app = express();

app.use("/api/v1", rootRouter);

// DB Connection

connectToDB();

app.listen(3000, () => {
  console.log("Server running at port 3000");
});
