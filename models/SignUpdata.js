const mongoose = require("mongoose");
const SignupSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    contact: { type: Number, required: true, trim: true },
    password: { type: String, required: true, trim: true },
    cfpassword: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);
const signupmodel = mongoose.model("SignupData", SignupSchema);
module.exports = signupmodel;
