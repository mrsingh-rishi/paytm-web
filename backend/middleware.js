const jwt = require("jsonwebtoken");
const { JWT_SCECRET_KEY } = require("./config");

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(403).json({});
  }

  const token = authHeader.split(" ")[1];

  try {
    const decode = jwt.verify(token, JWT_SCECRET_KEY);
    req.userId = decode.userId;
    next();
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  authMiddleware,
};
