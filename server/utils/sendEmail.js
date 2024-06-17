const nodemailer = require("nodemailer");
const { NOTIFICATION_EMAIL, NOTIFICATION_PASSWORD } = require("../config");

const createTransport = async (SENDER_EMAIL_ID, SENDER_EMAIL_PASSWORD) => {
  try {
    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: SENDER_EMAIL_ID,
        pass: SENDER_EMAIL_PASSWORD,
      },
    });
    return transport;
  } catch (error) {
    console.error("Error occurred in createTransport()");
    console.error(error);
    throw error;
  }
};

const sendEmail = async ({ to, subject, html }) => {
  const transporter = await createTransport(
    NOTIFICATION_EMAIL,
    NOTIFICATION_PASSWORD
  );

  const mailOptions = {
    from: NOTIFICATION_EMAIL,
    to: to,
    subject: subject,
    html: html,
  };

  return transporter.sendMail(mailOptions, (error, info) => {
    if (error) console.error(error);
    else console.log("Email sent: " + info.response);
  });
};

module.exports = sendEmail;
