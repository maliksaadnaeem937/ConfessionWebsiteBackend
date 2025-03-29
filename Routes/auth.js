const express = require("express");

const {
  isAuthenticated,
  verifyOtp,
  loginUser,
} = require("@middlewares/AuthMiddleWare/AuthMiddleWares.js");

const AuthController = require("@controllers/AuthController/AuthController.js");

const router = express.Router();

// auth routes
router.post("/register", AuthController.registerUser);

router.post(
  "/login",
  loginUser,
  AuthController.createAccessRefTokenAndSendResponse
);
router.post("/logout", isAuthenticated, AuthController.logoutUser);

// otp routes
router.post(
  "/verify-otp",
  verifyOtp,
  AuthController.createAccessRefTokenAndSendResponse
);

router.post("/resend-otp", AuthController.sendRegistrationOTP);

// forget password routes
router.post("/forget-password", isAuthenticated, AuthController.forgetPassword);

router.post("/reset-password/:token", AuthController.resetForgetPassword);

router.post(
  "/resend-forget-password-email/:token",
  AuthController.resendForgetPasswordEmail
);

//  get requests

router.get("/login", isAuthenticated, AuthController.ifLoggedRevokeAccess);
router.get("/register", isAuthenticated, AuthController.ifLoggedRevokeAccess);

module.exports = router;
