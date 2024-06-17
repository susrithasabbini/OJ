const sendEmail = require("./sendEmail");

const sendResetPasswordEmail = async ({ name, email, token, origin }) => {
  const resetUrl = `${origin}/user/reset-password?token=${token}&email=${email}`;
  const message = `
    <p>Please click the link below to reset your password:</p>
    <a href="${resetUrl}">Reset Password</a>`;
  return sendEmail({
    to: email,
    subject: "Reset Password",
    html: `<h4>Hello, ${name}</h4> ${message}`,
  });
};

module.exports = sendResetPasswordEmail;
