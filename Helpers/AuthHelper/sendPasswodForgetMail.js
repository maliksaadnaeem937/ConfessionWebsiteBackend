const nodemailer = require("nodemailer");
const MyError = require("@middlewares/Error.js");
const jwt = require("jsonwebtoken");
const transporter = require("./transporter.js");

const forgetPasswordMail = async (email) => {
  try {
    const token = jwt.sign({}, process.env.JWT_FORGET_PASSWORD_SECRET, {
      expiresIn: process.env.JWT_EMAIL_TOKEN_TIME,
    });

    const resetLink = `${process.env.PASSWORD_RESET_FRONTEND_URL}/${token}`;

    const info = await transporter.sendMail({
      from: `"Saad Web" <${process.env.EMAIL_USER}>`, // Sender
      to: email, // Recipient
      subject: "Reset Your Password",
      html: `<h3>Reset Your Password</h3>
             <p>Click the link below to reset your password. This link is valid for 15 minutes.</p>
             <a href="${resetLink}">${resetLink}</a>`,
    });
    return token;
  } catch (error) {
    throw new MyError(500, "Email Sending Failed!");
  }
};

module.exports = forgetPasswordMail;
