const bcrypt = require("bcryptjs");

const encryptPassword = async (originalpassword) => {
  try {
    let encryptedPassword = await bcrypt.hash(originalpassword, 10);
    return encryptedPassword;
  } catch (error) {
    console.log(error);
  }
};

const verifyPassword = async (inputPassword, encryptedPassword) => {
  try {
    const checkPassword = await bcrypt.compare(
      inputPassword,
      encryptedPassword
    );
    return checkPassword;
  } catch (error) {
    console.log(error);
  }
};
module.exports = { encryptPassword, verifyPassword };
