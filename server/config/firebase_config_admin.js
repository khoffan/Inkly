const admin = require("firebase-admin");


const isProd = process.env.NODE_ENV === "production" ? true : false;

let serviceParse;
if(isProd) {
  const serviceEnv = process.env.FIREBASE_SERVICE;
  serviceParse = JSON.parse(serviceEnv);
} else {
  const serviceAccount = require("../firebase-service.json");
  serviceParse = serviceAccount;
}

const app = admin.initializeApp({
  credential: admin.credential.cert(serviceParse)
});

module.exports = app;
