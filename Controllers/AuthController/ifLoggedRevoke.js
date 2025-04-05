const MyError = require("@middlewares/Error.js");

const ifLoggedRevokeAccess = (req, res, next) => {
  try {
    if (req.login) {
      console.log(" logged");

      return res.status(301).json({
        message: "Already Logged In!",
        status: 301,
      });
    } else {
      console.log("not logged");
      return res.status(200).json({
        message: "Give Access!",
        status: 200,
      });
    }
  } catch (e) {
    MyError.errorMiddleWare(e, res);
  }
};

module.exports = ifLoggedRevokeAccess;
