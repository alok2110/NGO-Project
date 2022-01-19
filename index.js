const express = require("express");
const bodyParser = require("body-parser");
const connect = require("./config/db");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const userRouter = require("./routes/userRoutes");
const adminRouter = require("./routes/adminRoutes");
const superAdminRouter = require("./routes/superAdminRoutes");

require("dotenv").config();
const app = express();

app.use(cors());
app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static("public"));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

connect();
app.use(bodyParser.json());
app.use("/", userRouter);
app.use("/", adminRouter);
app.use("/", superAdminRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Your app is running");
});
