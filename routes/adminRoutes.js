const app = require("express");
const router = app.Router();
const auth = require("../utils/auth");
const {
  register,
  login,
  viewRegisteredUser,
  approveUser,
  rejectUser,
  viewApprovedUser,
  viewRejectedUser,
  genrateCoinAdmin,
  getGenrateCoinAdmin,
  sendCoinToUser,
  showAdminCoinDebitTransaction,
  showAdminCoinCreditTransaction,
} = require("../controllers/AdminController");

router.post("/registerAdmin", register);
router.post("/loginAdmin", login);
router.get("/viewRegisteredUser", auth, viewRegisteredUser);
router.get("/approveUser/:id", auth, approveUser);
router.get("/rejectUser/:id", auth, rejectUser);
router.get("/viewApprovedUser", auth, viewApprovedUser);
router.get("/viewRejectedUser", auth, viewRejectedUser);
router.post("/genrateCoinAdmin", auth, genrateCoinAdmin);
router.get("/getGenrateCoinAdmin", auth, getGenrateCoinAdmin);
router.post("/sendCoinToUser", auth, sendCoinToUser);
router.get(
  "/showAdminCoinDebitTransaction",
  auth,
  showAdminCoinDebitTransaction
);
router.get(
  "/showAdminCoinCreditTransaction",
  auth,
  showAdminCoinCreditTransaction
);

module.exports = router;
