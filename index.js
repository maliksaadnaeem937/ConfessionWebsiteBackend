const path = require("path");
const moduleAlias = require("module-alias");
const morgan = require("morgan");

// Dynamically resolve paths for Vercel
moduleAlias.addAliases({
  "@middlewares": path.resolve(__dirname, "MiddleWares"),
  "@AuthMiddleware": path.resolve(__dirname, "MiddleWares/AuthMiddleWare"),
  "@helpers": path.resolve(__dirname, "Helpers"),
  "@controllers": path.resolve(__dirname, "Controllers"),
  "@ConfessionController": path.resolve(
    __dirname,
    "Controllers/ConfessionController"
  ),
  "@models": path.resolve(__dirname, "Models"),
  "@classes": path.resolve(__dirname, "Classes"),
  "@routes": path.resolve(__dirname, "Routes"),
});
const express = require("express");
require("dotenv").config();
require("./DBConnection/connection.js");
const cookieParser = require("cookie-parser");
const confessionRouter = require("./Routes/confession.js");
const googleAuthRouter = require("./Routes/googleAuth.js");
const authRouter = require("./Routes/auth.js");

const passport = require("passport");
const passportSetup = require("./Helpers/AuthHelper/passport.js");
const cors = require("cors");
const app = express();
app.use(morgan("dev"));
app.use(cookieParser());

app.use(
  cors({
    // origin: "http://localhost:3000",
    origin: "https://confession-front-end.vercel.app",
    credentials: true,
  })
);
app.use(express.json());

app.use(passport.initialize());

app.use("/api", authRouter);

app.use("/auth", googleAuthRouter);

app.use("/api/confession/v1", confessionRouter);

app.get("/", (req, res) => {
  res.send("Hello, how are you?");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
