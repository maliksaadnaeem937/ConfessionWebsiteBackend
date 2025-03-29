const MyError = require("@middlewares/Error.js");

const logoutUser = (req, res, next) => {
  try {
    if (req.login) {
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      });

      res.clearCookie("accessToken", {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      });

      return res.status(200).json({
        message: "User logged out successfully!",
      });
    } else {
      return res.status(400).json({
        message: "You are already logged out",
      });
    }
  } catch (e) {
    MyError.errorMiddleWare(e, res);
    
  }
};
module.exports = logoutUser;
