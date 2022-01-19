const app = require("express");
const router = app.Router();
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
router.get("/viewRegisteredUser", viewRegisteredUser);
router.get("/approveUser/:id", approveUser);
router.get("/rejectUser/:id", rejectUser);
router.get("/viewApprovedUser", viewApprovedUser);
router.get("/viewRejectedUser", viewRejectedUser);

module.exports = router;
