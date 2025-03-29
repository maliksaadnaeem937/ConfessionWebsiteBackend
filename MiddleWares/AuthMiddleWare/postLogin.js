const MyError = require("../Error.js");
const { VerifiedUserModel } = require("@models/user.js");
const jwt = require("jsonwebtoken");

const bcrypt = require("bcryptjs");
const postLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await VerifiedUserModel.findOne({ email });

    if (!user) {
      throw new MyError(400, "Invalid Credentials!");
    } else if (user && user?.authProvider !== "local") {
      throw new MyError(400, "Continue Login With Social Account!");
    } else if (
      user &&
      (await bcrypt.compare(password, user?.security?.passwordHash))
    ) {
      req.verifiedUser = user;
      return next();
    } else {
      throw new MyError(400, "Invalid Credentials!");
    }
  } catch (e) {
    return MyError.errorMiddleWare(e, res);
  }
};
module.exports = postLogin;
