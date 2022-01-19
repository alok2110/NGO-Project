const app = require("express");
const router = app.Router();
const auth = require("../utils/auth");

const {
  register,
  registerValiations,
  verifyEmail,
  loginValiations,
  login,
  emailSend,
  changePassword,
} = require("../controllers/UserController");

router.post("/register", registerValiations, register);
router.post("/verifyEmail", verifyEmail);
router.post("/login", loginValiations, login);
router.post("/resetPassword/emailSend", emailSend);
router.post("/changePassword", changePassword);

module.exports = router;
