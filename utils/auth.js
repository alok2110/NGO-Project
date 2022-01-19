const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Admin = require("../models/Admin");
const SuperAdmin = require("../models/SuperAdmin");
module.exports = (req, res, next) => {
  const authHeaders = req.headers.authorization;
  const token = authHeaders.split("Bearer ")[1];
  try {
    jwt.verify(token, process.env.SECRET, (err, payload) => {
      if (err) {
        return res.status(401).json({ error: "You must be logged in" });
      }
      if (payload.user.name === "Admin") {
        const { _id } = payload.user;
        console.log(payload.user);
        Admin.findById(_id).then((userdata) => {
          req.user = userdata;
          next();
        });
      } else if (payload.user.name === "Super Admin") {
        const { _id } = payload.user;
        console.log(payload.user);
        Admin.findById(_id).then((userdata) => {
          req.user = userdata;
          next();
        });
      } else {
        const { _id } = payload.user;
        User.findById(_id).then((userdata) => {
          req.user = userdata;
          next();
        });
      }
    });
  } catch (error) {
    return res.status(401).json({ errors: [{ msg: error.message }] });
  }
};
