// const jwt = require("jsonwebtoken");

// const generateAuthTokenandsetCookie = (userId, res) => {
//   const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
//     expiresIn: "6d",
//   });
//   res.cookie("jwt", token, {
//     // maxAge:15*24*60*60*1000,//4 days
//     httpOnly: true,
//     samsite: "strict",
//     // secure: process.env.NODE_ENV !== "developement",
//   });
// };

// module.exports = generateAuthTokenandsetCookie;


const jwt = require("jsonwebtoken");

const generateAuthTokenandsetCookie = (user, res) => {
  const payload = {
    _id: user._id,
    username: user.username,
    email: user.email,
    dob: user.dob,
    universityname:user.universityname
  };

  const token = jwt.sign({payload}, process.env.JWT_SECRET, {
    expiresIn: "6d",
  });

  res.cookie("jwt", token, {
    // maxAge:15*24*60*60*1000, // 4 days
    httpOnly: true,
    samesite: "strict",
    // secure: process.env.NODE_ENV !== "development",
  });
};

module.exports = generateAuthTokenandsetCookie;
