const MyError = require("@middlewares/Error.js");
const jwt = require("jsonwebtoken");
const { VerifiedUserModel } = require("@models/user.js");
const { sendForgetPasswordMail } = require("@helpers/AuthHelper/AuthHelper.js");

const resendForgetPasswordEmail = async (req, res) => {
  try {
    const { token } = req.params;
    if (!token) {
      throw new MyError(400, "|| Invalid request || Token missing ||");
    }

    const user = await VerifiedUserModel.findOne({ token });
    if (!user) {
      // if there is no user against the token provided in  params
      throw new MyError(404, "|| Invalid Token || User not found ||");
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_FORGET_PASSWORD_SECRET);
      if (decoded) {
        // cuz token is valid
        return res.status(400).json({
          message: "|| Use the current link || It is valid for 15min ||",
        });
      }
    } catch (e) {
      const newToken = await sendForgetPasswordMail(user.email);

      await VerifiedUserModel.findOneAndUpdate(
        { email: user.email },
        { $set: { token: newToken, lastTokenTime: Date.now() } }
      );

      return res.status(200).json({
        message: "||A new email has been sent || Check your email ||",
      });
    }
  } catch (e) {
    MyError.errorMiddleWare(e, res);
  }
};
module.exports = resendForgetPasswordEmail;
