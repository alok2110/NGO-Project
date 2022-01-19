const app = require("express");
const router = app.Router();
const {
  registerSuperAdmin,
  loginSuperAdmin,
} = require("../controllers/SuperAdminController");
router.post("/registerSuperAdmin", registerSuperAdmin);
router.post("/loginSuperAdmin", loginSuperAdmin);

module.exports = router;
