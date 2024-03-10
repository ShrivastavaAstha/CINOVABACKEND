const jwt = require("jsonwebtoken");
const verifyToken = (token) => {
  try {
    const result = jwt.verify(token, "secretKey");
    return result;
  } catch (error) {
    console.log(error);
  }
};
module.exports = verifyToken;
