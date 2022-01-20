const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");
const Otp = require("../models/Otp");
const Admin = require("../models/Admin");
const CoinGenrateHistory = require("../models/CoinGenrateHistory");
const Transaction = require("../models/Transaction");
var ObjectId = require("mongodb").ObjectID;

const createToken = (user) => {
  return jwt.sign({ user }, process.env.SECRET, {
    expiresIn: "7d",
  });
};
module.exports.registerValiations = [
  body("firstName")
    .not()
    .isEmpty()
    .trim()
    .withMessage("First Name is required"),
  body("lastName").not().isEmpty().trim().withMessage("Last Name is required"),
  body("dob").not().isEmpty().trim().withMessage("dob is required"),
  body("email").not().isEmpty().trim().withMessage("Email is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be 6 characters long"),
];
module.exports.register = async (req, res) => {
  const {
    firstName,
    lastName,
    dob,
    address1,
    address2,
    village,
    pin,
    password,
    city,
    state,
    mobile,
    email,
    aadharNumber,
    panNumber,
  } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const checkUser = await User.findOne({ email });
    if (checkUser) {
      return res
        .status(400)
        .json({ errors: [{ msg: "Email is already taken" }] });
    }
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    try {
      const user = await User.create({
        firstName,
        lastName,
        dob,
        address1,
        address2,
        village,
        pin,
        password: hash,
        city,
        state,
        mobile,
        email,
        aadharNumber,
        panNumber,
      });
      const token = createToken(user);
      let otpData = new Otp({
        email,
        code: Math.floor(100000 + Math.random() * 900000),
        expireIn: new Date().getTime() + 300 * 1000,
      });
      let optResponse = await otpData.save();
      mailer(email, otpData.code);
      return res.status(200).json({
        msg: "Otp has sended to your email. Please verify your email",
        token,
        email,
      });
    } catch (error) {
      return res.status(500).json({ errors: error });
    }
  } catch (error) {
    return res.status(500).json({ errors: error });
  }
};

module.exports.verifyEmail = async (req, res) => {
  let data = await Otp.find({ email: req.body.email, code: req.body.code });
  if (data) {
    let currentTime = new Date().getTime();
    let diff = data.expireIn - currentTime;
    if (diff < 0) {
      return res.status(400).json({ errors: [{ msg: "Token expire" }] });
    } else {
      const emailVerifiedStatus = await User.findOneAndUpdate(
        { email: req.body.email },
        { emailVerified: 1 }
      );
      return res.status(200).json({ msg: "Email verified successfully" });
    }
  } else {
    return res.status(400).json({ errors: [{ msg: "Token Expired" }] });
  }
};

const mailer = (email, otp) => {
  var nodemailer = require("nodemailer");
  var transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "arijithajra62@gmail.com",
      pass: "gdruocofmzahwsdn",
    },
  });
  var mailOptions = {
    from: "arijithajra62@gmail.com",
    to: email,
    subject: "OTP for Email verification",
    html: `<html><body><p>Hi,</p><p>Thank you for showing interest in our NGO.</p> <p>Please use the following One Time Password to verify your email id and create your profile.</p> <p><b>OTP:</b> ${otp} </p></body></html>`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

module.exports.loginValiations = [
  body("email").not().isEmpty().trim().withMessage("Email is required"),
  body("password").not().isEmpty().withMessage("Password is required"),
];

module.exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      const matched = await bcrypt.compare(password, user.password);
      if (matched) {
        if (user.emailVerified === 1) {
          const token = createToken(user);
          return res
            .status(200)
            .json({ msg: "You have login successfully", token, user });
        } else {
          return res
            .status(400)
            .json({ errors: [{ msg: "Please verify your email" }] });
        }
      } else {
        return res
          .status(401)
          .json({ errors: [{ msg: "Password is not correct" }] });
      }
    } else {
      return res.status(404).json({ errors: [{ msg: "Email not found" }] });
    }
  } catch (error) {
    return res.status(500).json({ errors: error });
  }
};

module.exports.emailSend = async (req, res) => {
  const { email } = req.body;
  if (email === "") {
    res.status(500).json({ msg: "Email is required" });
  } else {
    try {
      const checkUser = await User.findOne({ email });
      if (checkUser) {
        let otpData = new Otp({
          email,
          code: Math.floor(100000 + Math.random() * 900000),
          expireIn: new Date().getTime() + 300 * 1000,
        });

        let optResponse = await otpData.save();
        passwordResetMailer(email, otpData.code);
        return res.status(200).json({ msg: "OTP sended to your mail" });
      } else {
        return res.status(400).json({ errors: [{ msg: "Email not exist" }] });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ errors: error });
    }
  }
};

module.exports.changePassword = async (req, res) => {
  let data = await Otp.find({ email: req.body.mail, code: req.body.code });
  if (data) {
    let currentTime = new Date().getTime();
    let diff = data.expireIn - currentTime;
    if (diff < 0) {
      return res.status(400).json({ errors: [{ msg: "Token expire" }] });
    } else {
      let user = await User.findOne({ email: req.body.email });
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(req.body.password, salt);
      user.password = hash;
      user.save();
      return res.status(200).json({ msg: "Password changes successfully" });
    }
  } else {
    return res.status(400).json({ errors: [{ msg: "Token Expired" }] });
  }
};

const passwordResetMailer = (email, otp) => {
  var nodemailer = require("nodemailer");
  var transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "arijithajra62@gmail.com",
      pass: "gdruocofmzahwsdn",
    },
  });
  var mailOptions = {
    from: "arijithajra62@gmail.com",
    to: email,
    subject: "OTP for Password Reset",
    html: `<html><body><p>Hi,</p><p>Thank you for showing interest in our NGO.</p> <p>Please use the following One Time Password to reset your password.</p> <p><b>OTP:</b> ${otp} </p></body></html>`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

module.exports.genrateCoinUser = async (req, res) => {
  const { genratedCoin } = req.body;
  const { coins } = await User.findOne({ _id: ObjectId(req.user._id) });
  const totalCoins = genratedCoin + coins;
  try {
    const genrateCoinAdmin = await User.findByIdAndUpdate(
      { _id: ObjectId(req.user._id) },
      {
        coins: totalCoins,
      }
    );
    const { firstName, coins } = await User.findOne({
      _id: ObjectId(req.user._id),
    });
    const addHistory = await CoinGenrateHistory.create({
      userId: req.user._id,
      name: firstName,
      coin: genratedCoin,
      genrateDate: new Date().toDateString(),
    });
    return res.status(200).json({ msg: "Coin genrated successfully", coins });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ errors: error });
  }
};

module.exports.getGenrateCoinUser = async (req, res) => {
  try {
    const getData = await CoinGenrateHistory.find({
      userId: ObjectId(req.user._id),
    });
    res.status(200).json({ response: getData });
  } catch (error) {
    return res.status(500).json({ errors: error });
  }
};

module.exports.sendCoinToUser = async (req, res) => {
  const { mobile, sendCoin } = req.body;

  const getUser = await User.findOne({ _id: ObjectId(req.user._id) });
  const { _id, coins } = getUser;
  const checkUser = await User.findOne({ mobile });
  if (checkUser === null) {
    res.status(404).json({ msg: "mobile number not found" });
  } else {
    if (coins >= sendCoin) {
      try {
        const minusUserCoin = coins - sendCoin;
        const updateUserCoin = await User.findByIdAndUpdate(
          { _id: ObjectId(req.user._id) },
          {
            coins: minusUserCoin,
          }
        );
        const { id } = checkUser;
        const totalCoinSended = sendCoin + checkUser.coins;
        const updateCoin = await User.findByIdAndUpdate(
          { _id: ObjectId(id) },
          {
            coins: totalCoinSended,
          }
        );
        const addTransaction = await Transaction.create({
          coins: sendCoin,
          sender_phone: getUser.mobile,
          sender_name: getUser.firstName + " " + getUser.lastName,
          receiver_name: checkUser.firstName + " " + checkUser.lastName,
          receiver_phone: checkUser.mobile,
        });
        const getUserDetail = await User.findOne({
          _id: ObjectId(req.user._id),
        });
        const updatedCoin = getUserDetail.coins;

        res
          .status(200)
          .json({ msg: "coins sended successfully", getUser, updatedCoin });
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log("sender coin is greater");
    }
  }
};

module.exports.sendCoinToAdmin = async (req, res) => {
  const { sendCoin, mobile } = req.body;

  const getUser = await User.findOne({ _id: ObjectId(req.user._id) });
  const { _id, coins } = getUser;
  const checkUser = await Admin.findOne({ mobile });
  if (checkUser === null) {
    res.status(404).json({ msg: "admin not found" });
  } else {
    if (coins >= sendCoin) {
      try {
        const minusUserCoin = coins - sendCoin;
        const updateUserCoin = await User.findByIdAndUpdate(
          { _id: ObjectId(req.user._id) },
          {
            coins: minusUserCoin,
          }
        );
        const { id } = checkUser;
        const totalCoinSended = sendCoin + checkUser.coins;
        const updateCoin = await Admin.findByIdAndUpdate(
          { _id: ObjectId(id) },
          {
            coins: totalCoinSended,
          }
        );
        const addTransaction = await Transaction.create({
          coins: sendCoin,
          sender_phone: getUser.mobile,
          sender_name: getUser.firstName + " " + getUser.lastName,
          receiver_name: checkUser.name,
          receiver_phone: checkUser.mobile,
        });
        const getUserDetail = await User.findOne({
          _id: ObjectId(req.user._id),
        });
        const updatedCoin = getUserDetail.coins;
        res.status(200).json({ msg: "coins sended successfully", updatedCoin });
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log("sender coin is greater");
    }
  }
};

module.exports.showUserCoinDebitTransaction = async (req, res) => {
  try {
    const getTran = await Transaction.find({ sender_phone: req.user.mobile });
    return res.status(200).json(getTran);
  } catch (error) {
    console.log(error);
  }
};

module.exports.showUserCoinCreditTransaction = async (req, res) => {
  try {
    const getTran = await Transaction.find({ receiver_phone: req.user.mobile });
    return res.status(200).json(getTran);
  } catch (error) {
    console.log(error);
  }
};
