// const generateTokenResponse = require("../MiddleWares/generateTokenResponse.js");

const postRegister = require("./postRegister.js");
const sendOTP = require("./sendOTP.js");
const generateTokenResponse = require("./generateTokenResponse.js");
const ifLoggedRevokeAccess = require("./ifLoggedRevoke.js");
const forgetPassword = require("./forgetPassword.js");
const resetForgetPassword = require("./resetForgetPassword.js");
const resendForgetPasswordEmail = require("./resendForgetPasswordEmail.js");
const logoutUser = require("./logoutUser.js");

class AuthController {
  static createAccessRefTokenAndSendResponse = generateTokenResponse;
  static forgetPassword = forgetPassword;
  static sendRegistrationOTP = sendOTP;
  static logoutUser = logoutUser;
  static resetForgetPassword = resetForgetPassword;
  static resendForgetPasswordEmail = resendForgetPasswordEmail;
  static registerUser = postRegister;
  static ifLoggedRevokeAccess = ifLoggedRevokeAccess;
}

module.exports = AuthController;
