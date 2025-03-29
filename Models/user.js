const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userBaseSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
    required: true,
  },
  name: {
    first: {
      type: String,
      required: false,
      trim: true,
    },
    last: {
      type: String,
      required: false,
      trim: true,
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  security: {
    passwordHash: {
      type: String,
      required: false,
    },
  },
  banned: {
    type: Boolean,
    default: false,
  },

  role: { type: String, enum: ["user", "admin"], default: "user" },
});

const UserSchema = new mongoose.Schema({
  ...userBaseSchema.obj,
  createdAt: { type: Date, default: Date.now, expires: "10h" },
  otpCode: { type: String, default: "" },
  lastOtpTime: { type: Date, default: Date.now },
});

const VerifiedUserSchema = new mongoose.Schema(
  {
    ...userBaseSchema.obj,
    token: { type: String, default: "" },
    authProvider: { type: String, enum: ["local", "google"], default: "local" },
    lastTokenTime: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const VerifiedUserModel = mongoose.model("Verified", VerifiedUserSchema);
const UserModel = mongoose.model("Unverified", UserSchema);

module.exports = { VerifiedUserModel, UserModel };
