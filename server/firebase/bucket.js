var admin = require("firebase-admin");

const { storageBucket, serviceAccount } = require("../config");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: storageBucket,
});

const bucket = admin.storage().bucket();

module.exports = bucket;
