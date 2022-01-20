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
  genrateCoinUser,
  getGenrateCoinUser,
  sendCoinToUser,
  sendCoinToAdmin,
  showUserCoinDebitTransaction,
  showUserCoinCreditTransaction,
} = require("../controllers/UserController");

router.post("/register", registerValiations, register);
router.post("/verifyEmail", verifyEmail);
router.post("/login", loginValiations, login);
router.post("/resetPassword/emailSend", emailSend);
router.post("/changePassword", changePassword);
router.post("/genrateCoinUser", auth, genrateCoinUser);
router.get("/getGenrateCoinUser", auth, getGenrateCoinUser);
router.post("/sendCoinToUser", auth, sendCoinToUser);
router.post("/sendCoinToAdmin", auth, sendCoinToAdmin);
router.get("/showUserCoinDebitTransaction", auth, showUserCoinDebitTransaction);
router.get(
  "/showUserCoinCreditTransaction",
  auth,
  showUserCoinCreditTransaction
);

module.exports = router;
