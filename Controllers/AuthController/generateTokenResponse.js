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
    
    // Get domain from request or use environment variable
    const domain = process.env.NODE_ENV === "production" ? ".vercel.app" : undefined;
    
    // Set cookie options
    const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      path: "/",
      domain: domain
    };
    
    res.cookie("refreshToken", refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    
    res.cookie("accessToken", accessToken, {
      ...cookieOptions,
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