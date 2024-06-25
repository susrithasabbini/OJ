const { config } = require("dotenv");
const path = require("path");

config({ path: path.resolve(__dirname, "../.env") });

// env variables
const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_LIFETIME = process.env.JWT_LIFETIME;
const NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL;
const NOTIFICATION_PASSWORD = process.env.NOTIFICATION_PASSWORD;
const ORIGIN = process.env.ORIGIN;

module.exports = {
  PORT,
  MONGO_URI,
  JWT_LIFETIME,
  JWT_SECRET,
  NOTIFICATION_EMAIL,
  NOTIFICATION_PASSWORD,
  ORIGIN,
};
