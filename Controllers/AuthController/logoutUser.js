const MyError = require("@middlewares/Error.js");

const logoutUser = (req, res, next) => {
  try {
    console.log("logging out user");
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
        status: 200,
      });
    } else {
      
      return res.status(400).json({
        message: "You are already logged out",
        status: 400,
      });
    }
  } catch (e) {
    MyError.errorMiddleWare(e, res);
  }
};
module.exports = logoutUser;
