const createSaveVerifiedUser = require("@helpers//AuthHelper/createSaveUser.js");
const { VerifiedUserModel, UserModel } = require("@models/user.js");
const MyError = require("../Error.js");

const authenticateWithGoogle = async (req, res, next) => {
  console.log("inside authenticate with google");
  try {
    const { user } = req;
    console.log("user", user);

    if (!user || !user.emails?.[0]?.value) {
      return res.status(401).json({
        success: false,
        message: "Google authentication failed",
      });
    }

    const email = user.emails[0].value;

    const unverifiedUser = await UserModel.findOne({ email });
    console.log("un", unverifiedUser);
    if (unverifiedUser) {
      return res.status(400).json({
        success: false,
        message: "Please complete registration  with email and password!",
      });
    }

    const verifiedUser = await VerifiedUserModel.findOne({ email });
    console.log("user is verified", verifiedUser);
    if (verifiedUser && verifiedUser?.authProvider === "local") {
      return res.status(400).json({
        success: false,
        message: "Please login with email  and password!",
      });
    } else if (verifiedUser && verifiedUser?.authProvider === "google") {
      req.verifiedUser = verifiedUser;
      console.log("user is veirified with google provider");
      return next();
    }
    return next();
  } catch (e) {
    MyError.errorMiddleWare(e, res);
  }
};

const registerWithGoogle = async (req, res, next) => {
  try {
    const email = req.user?.emails[0]?.value;
    const { user } = req;
    user.email = email;
    user.authProvider = "google";

    const verifiedUser = await createSaveVerifiedUser(user);

    if (!verifiedUser) {
      return res.status(500).json({
        success: false,
        message: "User creation failed Please try again!",
      });
    }

    req.verifiedUser = verifiedUser;

    return next();
  } catch (error) {
    return MyError.errorMiddleWare(error, res);
  }
};

class GoogleAuthentication {
  static authenticateWithGoogle = authenticateWithGoogle;
  static registerWithGoogle = registerWithGoogle;
}
module.exports = GoogleAuthentication;
