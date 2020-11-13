const auth = firebase.auth();
const API = require('call-of-duty-api')({ platform: "battle" });
const firestore = require('firebase-firestore');

var db = firebase.firestore();

const whenSignedIn = document.getElementById('whenSignedIn');
const whenSignedOut = document.getElementById('whenSignedOut');

const displayName = document.getElementById('displayName');

const signInBtn = document.getElementById('signInBtn');
const signOutBtn = document.getElementById('signOutBtn');

const provider = new firebase.auth.GoogleAuthProvider();

signInBtn.onclick = () => auth.signInWithPopup(provider);
signOutBtn.onclick = () => auth.signOut();

auth.onAuthStateChanged(user => {
    if (user) {
        // signed in
        whenSignedIn.hidden = false;
        whenSignedOut.hidden = true;
        displayName.textContent = user.displayName+"";
        
    } else {
        // not signed in
        whenSignedIn.hidden = true;
        whenSignedOut.hidden = false;
    }
});

function updateAccount() {
    var accountName = document.getElementById('calldutyid');
    var user = firebase.auth().currentUser;

    API.login("brett_saunders@btinternet.com", "").then(data2 => {
        //I want Warzone Data
        API.MWcombatwz(accountName).then(data => {
            data.matches.forEach((value) => {
                db.collection("users").doc(user.uid).collection("games").doc(value.matchID).set({
                    draw: value.draw,
                    duration: value.duration,
                    map: value.map,
                    mode: value.mode,
                    playerCount: value.playerCount,
                    teamCount: value.teamCount,
                    rank: value.player.rank,
                    kills: value.playerStats.kills,
                    score: value.playerStats.score,
                    deaths: value.playerStats.deaths,
                    damageDone: value.playerStats.damageDone,
                    damageTaken: value.playerStats.damageTaken,
                    assists: value.playerStats.assists
                });
            });
        }).catch(err => {
            console.log(err);
        });
    }).catch(err => {
        console.log(err);
    });
}