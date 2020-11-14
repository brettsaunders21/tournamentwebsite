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

exports.updateData = functions.https.onRequest((req, res) => {
    db.collection("tournaments").doc("current").collection("players").get().then(querySnapshot => {
        querySnapshot.forEach(doc => {
            db.collection("users").doc(doc.id).get().then(user => {
                var matchKeys = Object.keys(user.games);
                var matches = dict();

                API.login("brett_saunders@btinternet.com", "Benthomas1@").then(data2 => {
                    API.MWcombatwz(user.gameID).then(data => {
                        matches = data.matches;
                    }).catch(err => {
                        console.log(err);
                    });
                }).catch(err => {
                    console.log(err);
                });

                for(let matchID in matches){
                    if (!matchKeys.includes(matchID)) {
                        var match = matches[matchID];
                        db.collection("users").doc(doc.id).collection("games").doc(matchID).set({
                            draw: match.draw,
                            startTime: match.utcStartSeconds,
                            endTime: match.utcEndSeconds,
                            duration: match.duration,
                            map: match.map,
                            mode: match.mode,
                            playerCount: match.playerCount,
                            teamCount: match.teamCount,
                            rank: match.player.rank,
                            kills: match.playerStats.kills,
                            score: match.playerStats.score,
                            deaths: match.playerStats.deaths,
                            damageDone: match.playerStats.damageDone,
                            damageTaken: match.playerStats.damageTaken,
                            assists: match.playerStats.assists
                        },{merge: true});
                    }
                }

            });
        });
    });

    
});