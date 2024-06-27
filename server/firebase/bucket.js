var admin = require("firebase-admin");

var serviceAccount = require("D:/OnlineJudge/online-judge-3296b-firebase-adminsdk-82yo0-48e9bd89ab.json");
const { storageBucket } = require("../config");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: storageBucket,
});

const bucket = admin.storage().bucket();

module.exports = bucket;
