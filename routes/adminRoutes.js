const app = require("express");
const router = app.Router();
const { register, login } = require("../controllers/AdminController");
router.post("/registerAdmin", register);
router.post("/loginAdmin", login);

module.exports = router;
