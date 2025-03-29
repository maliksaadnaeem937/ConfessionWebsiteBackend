const { v4: uuidv4 } = require("uuid");
const validate = require("validate.js");
const validationRules = require("@helpers/AuthHelper/constraints.js");
const bcrypt = require("bcryptjs");
const { UserModel, VerifiedUserModel } = require("@models/user.js");
const MyError = require("@middlewares/Error.js");

class User {
  constructor() {
    this.createdAt = Date.now();
    this.id = uuidv4();
    this.name = {
      first: null,
      last: null,
    };
    this.email = null;
    this.security = {
      passwordHash: null,
    };
    this.banned = false;
    this.role = "user";
    this.otpCode = null;
  }

  async save() {
    try {
      const newUser = new UserModel({
        id: this.id,
        name: {
          first: this.name.first,
          last: this.name.last,
        },
        email: this.email,
        otpCode: this.otpCode,
        security: { passwordHash: this.security.passwordHash },
        banned: this.banned,
        createdAt: this.createdAt,
      });

      await newUser.save();
      return await UserModel.findOne({ email: this.email }).select(
        "-security -otpCode -banned -__v -_id -createdAt"
      );
    } catch (error) {
      throw new Error(500, "Failed to save user to the database");
    }
  }

  setFirstName(firstName) {
    const errorMessage = validate(
      { firstName },
      { firstName: validationRules.firstName }
    );

    if (!errorMessage) {
      this.name.first = firstName.trim();
    } else {
      throw new MyError(400, errorMessage.firstName[0]);
    }
  }

  setLastName(lastName) {
    const errorMessage = validate(
      { lastName },
      { lastName: validationRules.lastName }
    );

    if (!errorMessage) {
      this.name.last = lastName.trim();
    } else {
      throw new MyError(400, errorMessage.lastName[0]);
    }
  }
  async emailExists(email) {
    const user1 = await UserModel.findOne({ email: email });
    const user2 = await VerifiedUserModel.findOne({ email: email });
    if (user1 || user2) {
      return true;
    } else return false;
  }

  setOtpCode(otpCode) {
    this.otpCode = otpCode;
  }
  async setEmail(email) {
    if (await this.emailExists(email)) {
      throw new MyError(400, "Duplicate Email");
    }
    const errorMessage = validate({ email }, { email: validationRules.email });

    if (!errorMessage) {
      this.email = email.trim();
    } else {
      throw new MyError(400, errorMessage.email[0]);
    }
  }
  async setPassword(password) {
    const errorMessage = validate(
      { password },
      { password: validationRules.password }
    );

    if (!errorMessage) {
      password = password.trim();
      const saltRounds = 10;
      this.security.passwordHash = await bcrypt.hash(password, saltRounds);
    } else {
      throw new MyError(400, errorMessage.password[0]);
    }
  }
}
module.exports = User;
