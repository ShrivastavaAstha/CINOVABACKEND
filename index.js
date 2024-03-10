const express = require("express");
const app = express();
app.use(express.json());
const cookies = require("cookie-parser");
app.use(cookies());
const { connectDatabase } = require("./connection/connect");
const signupmodel = require("./models/SignUpData");
const notemodel = require("./models/Notedata");
const verifyToken = require("./tokens/verifyToken");
const generateToken = require("./tokens/generateToken");
const { encryptPassword, verifyPassword } = require("./functions/encryption");
const path = require("path");

//signupapi------------------------------------------------
app.post("/api/signupapi", async (req, res) => {
  try {
    const { email } = req.body;
    const UserEmailExist = await signupmodel.findOne({ email });
    if (UserEmailExist) {
      return res.json({ message: "Email Already Exists." });
    }
    const obj = {
      username: req.body.username,
      email: req.body.email,
      contact: req.body.contact,
      password: await encryptPassword(req.body.password),
      cfpassword: await encryptPassword(req.body.cfpassword),
    };
    console.log(obj);
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(req.body.email)) {
      const signupdata = new signupmodel(obj);
      await signupdata.save();
      return res.status(200).json({ success: true, message: "Data Saved." });
    } else {
      return res
        .status(200)
        .json({ success: false, message: "Invalid Email." });
    }
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

//signinapi--------------------------------------------------
app.post("/api/signin", async (req, res) => {
  try {
    let email = req.body.email;
    // const { email } = req.body;
    let inputpassword = req.body.password;
    const checkuser = await signupmodel.findOne({
      email: email,
    });
    if (!checkuser) {
      return res
        .status(400)
        .json({ success: false, error: "User not found,please signup first" });
    }
    let originalpassword = checkuser.password;
    if (await verifyPassword(inputpassword, originalpassword)) {
      const token = generateToken(checkuser._id);
      res.cookie("web_tk", token);
      console.log(token);
      return res.json({ success: true, message: "Logged in Successfully!" });
    } else {
      return res
        .status(400)
        .json({ success: false, error: "Incorrect password" });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, error: error.message });
  }
});

//logoutapi--------------------------------------------------
app.get("/api/logout", (req, res) => {
  try {
    res.clearCookie("web_tk");
    return res.json({ success: true });
  } catch (error) {
    console.log(error);
    console.log(error);
    return res.status(400).json({ success: false, error: error.message });
  }
});

//middleware------------------------------------------------
const checkIfUserSignedIn = (req, res, next) => {
  if (verifyToken(req.cookies.web_tk)) {
    const userinfo = verifyToken(req.cookies.web_tk);
    req.userid = userinfo.id;
    next();
  } else {
    return res.status(400).json({ success: false, error: "UNAUTORIZED" });
  }
};
//currentuserapi--------------------------------------------
app.get("/api/currentuser", checkIfUserSignedIn, async (req, res) => {
  try {
    const userid = req.userid;
    const userdetails = await signupmodel.findOne({ _id: userid });
    if (userdetails) {
      return res.json({ success: true, data: userdetails });
    } else {
      return res.status(400).json({ success: false, error: "User not found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ success: false, error: error.message });
  }
});
//addnote-------------------------------------------------------
app.post("/api/addnote", async (req, res) => {
  try {
    const newobj = {
      date: req.body.date,
      title: req.body.title,
      description: req.body.description,
    };
    console.log(newobj);
    const notedata = new notemodel(newobj);
    await notedata.save();
    return res.status(200).json({ success: true, message: "Data Saved" });
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message });
  }
});
//getnote------------------------------------------------------
app.get("/api/getdata", async (req, res) => {
  try {
    const note = await notemodel.find();
    return res.status(200).json({ success: true, data: note });
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message });
  }
});
//deletenote----------------------------------------------------
app.delete("/api/deletenote/:id", async (req, res) => {
  try {
    await notemodel.findByIdAndDelete(req.params.id);
    return res.json({ success: true });
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 8000;
connectDatabase();

app.use(express.static("client/build"));
app.get("*", (req, res) => {
  res.sendFile(
    path.resolve(__dirname + "/client/build/index.html"),
    function (err) {
      if (err) {
        console.log(err);
      }
    }
  );
});

app.listen(PORT, async () => {
  await console.log(`Server is running at ${PORT}`);
});
