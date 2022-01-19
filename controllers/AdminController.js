const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const Admin = require("../models/Admin");
const Otp = require("../models/Otp");

const createToken = (user) => {
  return jwt.sign({ user }, process.env.SECRET, {
    expiresIn: "7d",
  });
};

module.exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const checkUser = await Admin.findOne({ email });
    if (checkUser) {
      return res
        .status(400)
        .json({ errors: [{ msg: "Email is already taken" }] });
    }
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    try {
      const user = await Admin.create({
        name,
        email,
        password: hash,
      });
      const token = createToken(user);
      return res
        .status(200)
        .json({ msg: "Your account has been created", token });
    } catch (error) {
      return res.status(500).json({ errors: error });
    }
  } catch (error) {
    return res.status(500).json({ errors: error });
  }
};

module.exports.login = async (req, res) => {
  const errors = validationResult(req);

  const { email, password } = req.body;
  try {
    const user = await Admin.findOne({ email });
    if (user) {
      const matched = await bcrypt.compare(password, user.password);
      if (matched) {
        const token = createToken(user);
        const { _id } = user;
        updateSuccessCode = await Admin.findByIdAndUpdate(_id, {
          sucessCode: 1,
        });
        const upadtedUser = await Admin.findOne({ email });
        res.send({ msg: "Login Successfull", token, user });
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
