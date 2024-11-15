const jwt = require("jsonwebtoken");

require("dotenv").config();
const secret = process.env.JWT_SECRET;

function auth(req, res, next) {
  const token = req.headers.authorization;

  const response = jwt.verify(token, secret);

  if (response) {
    req.userId = token.userId;
    next();
  } else {
    res.status(403).json({
      message: "Incorrect creds",
    });
  }
}

module.exports = {
  auth,
};
