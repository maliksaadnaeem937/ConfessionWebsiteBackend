const { VerifiedUserModel } = require("@models/user.js");
const MyError = require("../Error.js");
const bindUser = async (req, res, next) => {
  try {
    const verifiedUser = await VerifiedUserModel.findOne({ id: req?.user?.id });
    if (!verifiedUser) {
      throw new MyError(404, "Invalid Confession");
    }
    req.user.objectId = verifiedUser?._id;
    return next();
  } catch (e) {
    return MyError.errorMiddleWare(e, res);
  }
};
module.exports = bindUser;
