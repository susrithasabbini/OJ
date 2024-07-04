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
const apiKey = process.env.apiKey;
const authDomain = process.env.authDomain;
const projectId = process.env.projectId;
const storageBucket = process.env.storageBucket;
const messagingSenderId = process.env.messagingSenderId;
const appId = process.env.appId;
const measurementId = process.env.measurementId;

const serviceAccount = {
  type: process.env.type,
  project_id: process.env.project_id,
  private_key_id: process.env.private_key_id,
  private_key: process.env.private_key.replace(/\\n/g, '\n'),
  client_email: process.env.client_email,
  client_id: process.env.client_id,
  auth_uri: process.env.auth_uri,
  token_uri: process.env.token_uri,
  auth_provider_x509_cert_url: process.env.auth_provider_x509_cert_url,
  client_x509_cert_url: process.env.client_x509_cert_url,
  universe_domain: process.env.universe_domain,
};

module.exports = {
  PORT,
  MONGO_URI,
  JWT_LIFETIME,
  JWT_SECRET,
  NOTIFICATION_EMAIL,
  NOTIFICATION_PASSWORD,
  ORIGIN,
  apiKey,
  authDomain,
  projectId,
  storageBucket,
  messagingSenderId,
  appId,
  measurementId,
  serviceAccount,
};
