const { sendForgetPasswordMail } = require("@helpers/AuthHelper/AuthHelper.js");
const { VerifiedUserModel } = require("@models/user.js");
const MyError = require("@middlewares/Error.js");

const forgetPassword = async (req, res, next) => {
  try {
    if (req.login) {
      throw new MyError(400, "|| You are already loggedIn ||");
    }
    const { email } = req.body;
    const user = await VerifiedUserModel.findOne({ email });

    if (!user) {
      throw new MyError(400, "|| User not found || Invalid Email ||");
    }
    if (user.authProvider === "google") {
      throw new MyError(400, "|| Continue With Google ||");
    }

    if (Date.now() - new Date(user.lastTokenTime).getTime() < 1 * 60 * 1000) {
      throw new MyError(
        400,
        "|| Request too soon || Try again after 1 minute ||"
      );
    }

    const token = await sendForgetPasswordMail(email);

    await VerifiedUserModel.findOneAndUpdate(
      { email },
      { $set: { token: token, lastTokenTime: Date.now() } }
    );

    return res.status(200).json({
      message: "||  Please check your email for the password reset link ||",
    });
  } catch (e) {
    return MyError.errorMiddleWare(e, res);
  }
};

module.exports = forgetPassword;
