const transporter = require("../config/mail");

const sendEmail = async (email, otp) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Chat Reactor - Email Verification",
    html: `
      <h2>Welcome to Chat Reactor 👋</h2>
      <p>Your verification code is:</p>
      <h1>${otp}</h1>
      <p>This OTP is valid for 5 minutes.</p>
    `,
  });
};

module.exports = sendEmail;