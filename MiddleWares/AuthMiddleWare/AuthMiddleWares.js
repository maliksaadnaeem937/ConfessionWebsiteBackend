const isAuthenticated = require("./authentication.js");
const verifyOtp = require("./verifyotp.js");
const postLogin = require("./postLogin.js");
const ifNotAuthenticatedRedirect = require("./ifNotAuthenticatedRedirect.js");
const bindUser=require("./bindUser.js");

class AuthMiddleware {
  static isAuthenticated = isAuthenticated;
  static verifyOtp = verifyOtp;
  static loginUser = postLogin;
  static ifNotAuthenticatedRedirect = ifNotAuthenticatedRedirect;
}

module.exports = {
  isAuthenticated,
  verifyOtp,
  loginUser: postLogin,
  ifNotAuthenticatedRedirect,
  bindUser
};
