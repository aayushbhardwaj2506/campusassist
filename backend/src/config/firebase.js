const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const path = require("path");

let serviceAccount;

if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
} else {
  serviceAccount = require(path.join(
    __dirname,
    "../../serviceAccountKey.json"
  ));
}

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

module.exports = { db };