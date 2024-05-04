const User = require("../models/User");
const bcrypt = require("bcrypt");
const generateAuthTokenandsetCookie = require("../utils/generateToken");
const connectToUserDatabase=require("../connectToUserDatabase")
const signup = async (req, res) => {
  try {
    const { username, email, dob, universityname, password, cpassword } =
      req.body;

    // Check if passwords match
    if (password !== cpassword) {
      return res.status(400).json("Passwords do not match");
    }

    // Check if user already exists
    const userExists = await User.findOne({ email: email });
    if (userExists) {
      return res.status(402).json("User already exists");
    }

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10); // Hash password with bcrypt

    // Remove cpassword from the newUser object
    const newUser = new User({
      username,
      email,
      dob,
      universityname,
      password: hashedPassword,
      cpassword: hashedPassword, // Store hashed password
    });

    if (newUser) {
      await newUser.save();
      console.log({
        _id: newUser._id,
        username: newUser.username,
      });
      res.status(201).json({
        _id: newUser._id,
        username: newUser.username,
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json("Internal server error");
  }
};




// const login = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email: email });

//     const isCorrectPass = await bcrypt.compare(password, user.password);
//     if (!isCorrectPass || !user) {
//       return res.status(400).json({ error: "Invalid password" });
//     }

//     // Generate authentication token and set cookie
//     generateAuthTokenandsetCookie(user, res);

//     // Send user data in response
//     res.status(200).json({
//       _id: user._id,
//       username: user.username,
//     });

//     console.log("Login is successful!!!!!");
//     console.log({
//       _id: user._id,
//       username: user.username,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json("Internal server error");
//   }
// };
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const isCorrectPass = await bcrypt.compare(password, user.password);

    if (!isCorrectPass) {
      return res.status(400).json({ error: "Wrong password" });
    }

    // Generate authentication token and set cookie
    generateAuthTokenandsetCookie(user, res);

    // Send user data in response
   res.status(200).json({
     _id: user._id,
     username: user.username,
     email: user.email,
     dob: user.dob,
     universityname: user.universityname,
   });

    console.log("Login is successful!!!!!");
    console.log({
      _id: user._id,
      username: user.username,
      email: user.email,
      dob: user.dob,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json("Internal server error");
  }
};

module.exports = { signup, login };
