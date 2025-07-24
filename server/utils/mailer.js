// server/utils/mailer.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your_email@gmail.com',           // ✅ اپنا Gmail
    pass: 'your_app_password_here'          // ✅ App Password (Gmail سے بنائیں)
  }
});

// ✅ Reset Password Email
function sendResetEmail(user, resetLink) {
  const mailOptions = {
    from: '"Quran Learn Easy" <your_email@gmail.com>',
    to: user.email,
    subject: '🔐 Reset Your Password',
    html: `
      <h2>Password Reset</h2>
      <p>Assalamu Alaikum ${user.name},</p>
      <p>We received a request to reset your password.</p>
      <p><a href="${resetLink}">Click here to reset your password</a></p>
      <p>If you didn't request this, you can ignore this email.</p>
    `
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('❌ Reset Email Error:', error);
    } else {
      console.log('✅ Reset Email sent:', info.response);
    }
  });
}

module.exports = {
  sendResetEmail
};
