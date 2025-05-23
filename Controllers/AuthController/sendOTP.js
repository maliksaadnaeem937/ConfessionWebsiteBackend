const { UserModel } = require("@models/user.js");
const MyError = require("@middlewares/Error.js");
const { sendOTPMail } = require("@helpers/AuthHelper/AuthHelper.js");
const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await UserModel.findOne({ email });

    if (!user) {
      throw new MyError(400, "Register Please!");
    }

    if (Date.now() - user.lastOtpTime < 1 * 60 * 1000) {
      throw new MyError(400, "Please Wait before requesting");
    }

    const otp = await sendOTPMail(email);

    const updated = await UserModel.findOneAndUpdate(
      { email },
      { $set: { otpCode: otp, lastOtpTime: Date.now() } },
      { new: true }
    );

    return res.status(200).json({
      message: "OTP sent successfully!",
      success: true,
      status: 200,
    });
  } catch (e) {
    return MyError.errorMiddleWare(e, res);
  }
};
module.exports = sendOTP;
