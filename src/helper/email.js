const nodemailer = require("nodemailer");
require("dotenv").config();

let transporter = nodemailer.createTransport({
  host: "smtp.zoho.com",
  secure: true,
  port: 465,
  auth: {
    user: process.env.EMAIL_NAME,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendMail(mailOption) {
  try {
    const data = await transporter.sendMail(mailOption);
    console.log("email sent : ", data.response ?? data);
    return data.response;
  } catch (err) {
    console.log("email error : ", err.message ?? err);
    return false;
  }
}

const sendEmailActivatedotp = async (email_user, otp, name) => {
  const mailOption = {
    from: process.env.EMAIL_NAME,
    to: email_user,
    subject: `OTP for resetting password`,
    text: `Hello ${name}, please use this OTP to reset your password:  ${otp}`,
  };
  return await sendMail(mailOption);
};

const sendEmailActivated = async (email_user, url, name) => {
  const mailOption = {
    from: process.env.EMAIL_NAME,
    to: email_user,
    subject: `Hello ${name}, Please Verification for Resepku App`,
    text: `Hello ${name}, Please Verification for Resepku, this is your activated link ${url}`,
  };
  return await sendMail(mailOption);
};

module.exports = { sendEmailActivated, sendEmailActivatedotp };
