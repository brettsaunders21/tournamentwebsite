const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore();
const API = require("call-of-duty-api")({ platform: "battle" });

exports.newUser = functions.auth.user().onCreate((user) => {
    db.collection("users").doc(user.uid).set({
        displayName: user.displayName,
        email: user.email,
        gameIDAdded: false
    }).catch(function(error) {
        console.error("Error writing document: ", error);
    });
  });
