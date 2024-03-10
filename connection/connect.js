const mongoose = require("mongoose");
require("dotenv").config();
const connectDatabase = async () => {
  try {
    await mongoose.connect(process.env.URL).then(() => {
      console.log("Database Connected");
    });
  } catch (error) {
    console.log(error);
  }
};
module.exports = { connectDatabase };
