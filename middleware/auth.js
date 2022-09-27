//require jwt
const jwt = require("jsonwebtoken");
require('dotenv').config()

//jwt secret enviorment verible
const config = process.env.JWT_SECRET;

//verify jwt
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];

  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    const decoded = jwt.verify(token, config);
    return next();
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
};

//is admin
const isAdmin = async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];

  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    const decoded = jwt.verify(token, config);
    req.user = decoded;

    if (req.user.role === "admin") {
      return next();
    }
  } catch (err) {
    return res.status(401).send("Invalid user");
  }
};

//is admin or procurement
const isUser = async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];

  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    const decoded = jwt.verify(token, config);
    req.user = decoded;

    if (req.user.role === "user") {
      return next();
    }
  } catch (err) {
    return res.status(401).send("Invalid user");
  }
};



//export middleware
module.exports = {
  verifyToken,
  isAdmin,
  isUser
};
