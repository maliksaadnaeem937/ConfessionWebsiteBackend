const MyError = require("@middlewares/Error.js");
const { VerifiedUserModel } = require("@models/user.js");
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const validate = require("validate.js");
const validationRules = require("@helpers/AuthHelper/constraints.js");

const resetForgetPassword = async (req, res, next) => {
    try {
      const { password } = req.body;
      const { token } = req.params;
      const errorMessage = validate(
        { password },
        { password: validationRules.password }
      );
      if (errorMessage) {
        throw new MyError(400, errorMessage.password[0]);
      }
      if (!token) {
        throw new MyError(404, "|| Unauthorized request || Token missing ||");
      }
  
      try {
        const decoded = jwt.verify(token, process.env.JWT_FORGET_PASSWORD_SECRET);
      } catch (e) {
        throw new MyError(
          404,
          "|| Token expired || Kindly request for email resend ||"
        );
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
      console.log("New hashed password=> ", hashedPassword);
  
      const newUser = await VerifiedUserModel.findOneAndUpdate(
        { token },
        {
          $set: {
            security: { passwordHash: hashedPassword },
            token: "",
            lastTokenTime: Date.now(), // Reset time
          },
        },
        { new: true }
      );
      console.log(newUser);
      if (!newUser) {
        // token not present in db
        throw new MyError(400, "|| Couldn't update password || Invalid Token ||");
      }
  
      return res
        .status(200)
        .json({ message: "|| Password updated successfully ||" });
    } catch (e) {
      return MyError.errorMiddleWare(e, res);
    }
  };

  module.exports=resetForgetPassword;
