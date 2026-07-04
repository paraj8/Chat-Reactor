const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

(async () => {
  try {
    await transporter.verify();
    console.log("✅ SMTP Ready");
  } catch (err) {
    console.error("❌ SMTP Verify Failed");
    console.error(err);
  }
})();

module.exports = transporter;