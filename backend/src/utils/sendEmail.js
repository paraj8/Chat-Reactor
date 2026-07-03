const transporter = require("../config/mail");

const sendEmail = async (email, otp) => {
  try {
    const info = await transporter.sendMail({
      from: `"Chat Reactor" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verify your Chat Reactor account",
      html: `
<!DOCTYPE html>
<html lang="en">

<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Chat Reactor Verification</title>
</head>

<body style="
margin:0;
padding:40px 20px;
background:#0F172A;
font-family:Arial,Helvetica,sans-serif;
">

<table width="100%" cellpadding="0" cellspacing="0">
<tr>
<td align="center">

<table width="600" cellpadding="0" cellspacing="0" style="
background:#111827;
border:1px solid #334155;
border-radius:18px;
overflow:hidden;
">

<!-- Header -->

<tr>
<td
align="center"
style="
padding:45px 30px;
background:linear-gradient(135deg,#7C3AED,#8B5CF6);
">

<div style="
font-size:50px;
margin-bottom:14px;
">
💬
</div>

<h1 style="
margin:0;
font-size:34px;
font-weight:700;
color:#ffffff;
">
Chat Reactor
</h1>

<p style="
margin-top:12px;
font-size:15px;
color:#E9D5FF;
letter-spacing:.4px;
">
Secure • Fast • Private Messaging
</p>

</td>
</tr>

<!-- Body -->

<tr>
<td style="padding:45px;">

<h2 style="
margin:0 0 18px;
font-size:28px;
color:#F8FAFC;
">
Verify your email
</h2>

<p style="
font-size:16px;
line-height:28px;
color:#CBD5E1;
margin-bottom:16px;
">
Welcome to <strong style="color:#C4B5FD;">Chat Reactor</strong>.
</p>

<p style="
font-size:16px;
line-height:28px;
color:#CBD5E1;
margin-bottom:35px;
">
Use the verification code below to complete your registration.
</p>

<!-- OTP Card -->

<table width="100%" cellpadding="0" cellspacing="0">
<tr>
<td align="center">

<div style="
background:#1E293B;
border:2px dashed #8B5CF6;
border-radius:16px;
padding:30px;
">

<div style="
font-size:13px;
letter-spacing:3px;
text-transform:uppercase;
color:#94A3B8;
margin-bottom:16px;
">
Verification Code
</div>

<div style="
font-size:44px;
font-weight:bold;
letter-spacing:12px;
font-family:monospace;
color:#C4B5FD;
">
${otp}
</div>

</div>

</td>
</tr>
</table>

<p style="
margin-top:34px;
font-size:15px;
line-height:26px;
color:#FBBF24;
">
⏳ This verification code expires in <strong>5 minutes</strong>.
</p>

<div style="
margin-top:28px;
padding:18px;
background:#1E293B;
border-left:4px solid #8B5CF6;
border-radius:10px;
">

<p style="
margin:0;
font-size:15px;
line-height:26px;
color:#CBD5E1;
">
If you didn't request this verification code, you can safely ignore this email. Your account will remain secure.
</p>

</div>

</td>
</tr>

<!-- Footer -->

<tr>
<td style="
padding:30px;
text-align:center;
background:#0B1120;
border-top:1px solid #334155;
">

<p style="
margin:0;
font-size:14px;
color:#CBD5E1;
font-weight:600;
">
© ${new Date().getFullYear()} Chat Reactor
</p>

<p style="
margin-top:10px;
font-size:13px;
color:#94A3B8;
">
Secure • Fast • Private Messaging
</p>

<p style="
margin-top:8px;
font-size:13px;
color:#64748B;
">
Built with ❤️ by
<strong style="color:#A78BFA;">
Paraj Mandal
</strong>
</p>

</td>
</tr>

</table>

</td>
</tr>
</table>

</body>
</html>
      `,
    });

    console.log("✅ Email Sent:", info.messageId);
  } catch (error) {
    console.error("❌ Email Sending Failed");
    console.error(error);
    throw error;
  }
};

module.exports = sendEmail;