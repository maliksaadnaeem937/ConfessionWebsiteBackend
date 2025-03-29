const MyError = require("@middlewares/Error.js");

const ifLoggedRevokeAccess = (req, res, next) => {
  try {
    if (req.login) {
      return res.status(400).json({
        message: "Already Logged In!",
      });
    } else {
      return res.status(200).json({
        message: "Give Access!",
      });
    }
  } catch (e) {
    MyError.errorMiddleWare(e, res);
  }
};

module.exports = ifLoggedRevokeAccess;
