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
} = require("../controllers/AdminController");

router.post("/registerAdmin", register);
router.post("/loginAdmin", login);
router.get("/viewRegisteredUser", auth, viewRegisteredUser);
router.get("/approveUser/:id", auth, approveUser);
router.get("/rejectUser/:id", auth, rejectUser);
router.get("/viewApprovedUser", auth, viewApprovedUser);
router.get("/viewRejectedUser", auth, viewRejectedUser);

module.exports = router;
