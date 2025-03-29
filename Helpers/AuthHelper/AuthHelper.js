const createSaveVerifiedUser = require("./createSaveUser.js");
const sendForgetPasswordMail = require("./sendPasswodForgetMail.js");
const jwt = require("jsonwebtoken");
const transporter=require("./transporter.js");
const crypto=require("crypto");
const nodemailer = require("nodemailer");

const MyError = require("@middlewares/Error.js");
const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString(); 
};


const sendEmail = async (to) => {
  const otp = generateOTP();
  try {
    const info = await transporter.sendMail({
      from: `"Saad Web" <${process.env.EMAIL_USER}>`, // Sender
      to, // Recipient
      subject: "Your OTP Code",
      text: `Your OTP code is: ${otp}`,
      html: `<h3>Your OTP code is: <b>${otp}</b></h3><p>This code is valid for 5 minutes.</p>`,
    });

    console.log("Email sent:", info.messageId);
    return otp;
  } catch (error) {
    throw new MyError(500, "Email Sending Failed!");
  }
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.JWT_REFRESH_TOKEN_TIME }
  );
};


const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.JWT_ACCESS_TOKEN_TIME }
  );
};


module.exports = {
  createSaveVerifiedUser,
  generateOTP,
  generateAccessToken,
  generateRefreshToken,
  sendOTPMail:sendEmail,
  sendForgetPasswordMail,
};
