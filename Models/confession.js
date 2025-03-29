const mongoose = require("mongoose");

const confessionSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 1000,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId, // Now storing as ObjectId
      required: true,
      ref: "Verified", // Reference to VerifiedUserModel
    },
    isApproved: {
      type: Boolean,
      default: false, // Admin approval system
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Verified" }], // Store ObjectId references
    comments: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "Verified" },
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    reports: {
      type: Number,
      default: 0, // Users can report confessions if necessary
    },
  },
  { timestamps: true }
);

const Confession = mongoose.model("Confession", confessionSchema);
module.exports = Confession;
