const MyError = require("../Error.js");
const { UserModel, VerifiedUserModel } = require("@models/user.js");

const verifyOtp = async (req, res, next) => {
  try {
    const { otpCode, email } = req.body;

    const user = await UserModel.findOne({ email, otpCode }).select(
      "-otpCode -banned -__v -_id -createdAt"
    );

    if (!user || Date.now() - user.lastOtpTime > 5 * 60 * 1000) {
      throw new MyError(400, "Invalid OTP!");
    }
    const newUser = new VerifiedUserModel({
      id: user.id,
      name: { first: user.name.first, last: user.name.last },
      security: {
        passwordHash: user.security.passwordHash,
      },
      email: user.email,
      role: user.role,
      token: "",
      lastTokenTime: Date.now(),
      authProvider: "local",
    });

    await newUser.save();

    await UserModel.findOneAndDelete({ email: user.email });

    const verifiedUser = await VerifiedUserModel.findOne({
      email: user.email,
    }).select(
      "-banned -__v -_id -createdAt -updatedAt -security -token -lastTokenTime"
    );

    req.verifiedUser = verifiedUser;

    return next();
  } catch (e) {
    return MyError.errorMiddleWare(e, res);
  }
};
module.exports = verifyOtp;
