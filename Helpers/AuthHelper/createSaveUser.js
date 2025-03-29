const { VerifiedUserModel } = require("@models/user.js");

const createSaveVerifiedUser = async (user) => {
  const newUser = new VerifiedUserModel({
    id: user.id,
    name: {
      first: user.name?.givenName || "guest",
      last: user.name?.familyName || "guest",
    },
    email: user.email,
    role: "user",
    token: "",
    lastTokenTime: Date.now(),
    authProvider: user?.authProvider || "local",
  });

  await newUser.save();

  const verifiedUser = await VerifiedUserModel.findOne({
    email: user.email,
  }).select(
    "-token -banned -__v -_id -createdAt -updatedAt -security -lastTokenTime"
  );
  return verifiedUser;
};

module.exports = createSaveVerifiedUser;
