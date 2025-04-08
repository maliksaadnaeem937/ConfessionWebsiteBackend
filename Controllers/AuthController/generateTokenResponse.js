const MyError = require("@middlewares/Error.js");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("@helpers/AuthHelper/AuthHelper.js");

const generateTokenResponse = async (req, res, next) => {
  try {
    const { verifiedUser } = req;
    console.log(verifiedUser);
    if (!verifiedUser) {
      return next();
    }
    const accessToken = generateAccessToken({
      id: verifiedUser.id,
      email: verifiedUser.email,
      role: verifiedUser.role,
    });

    const refreshToken = generateRefreshToken({
      id: verifiedUser.id,
      email: verifiedUser.email,
      role: verifiedUser.role,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "Lax",
      maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day
    });

    return res.status(200).json({
      success: true,
      message: "Login Successful!",
      user: {
        id: verifiedUser.id,
        email: verifiedUser.email,
        role: verifiedUser.role,
      },
    });
  } catch (e) {
    return MyError.errorMiddleWare(e, res);
  }
};

module.exports = generateTokenResponse;
