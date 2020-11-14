const auth = firebase.auth();
const db = firebase.firestore();

const whenSignedIn = document.getElementById('whenSignedIn');
const whenSignedOut = document.getElementById('whenSignedOut');

const displayName = document.getElementById('displayName');
const codIDForm = document.getElementById('cod-id-form');
const adminSection = document.getElementById('admin');

const provider = new firebase.auth.GoogleAuthProvider();
codIDForm.hidden = true;


auth.onAuthStateChanged(user => {
    if (user) {
        // signed in
        whenSignedIn.hidden = false;
        whenSignedOut.hidden = true;
        displayName.textContent = user.displayName+"";

        var docRef = db.collection("admins").doc(user.uid).get().then(admin => {
            if (admin.exists) {
                adminSection.innerHTML = '<a  class="dropdown-item" href="#"><i class="fas fa-list fa-sm fa-fw mr-2 text-gray-400"></i>Admin</a>';
            }
        });

        var docRef = db.collection("users").doc(user.uid);

        docRef.get().then(function(doc) {
            if (doc.exists && doc.data().gameIDAdded === true) {
                codIDForm.hidden = true;
            
            } else {
                codIDForm.hidden = false;
            }

        });
        
    } else {
        // not signed in
        whenSignedIn.hidden = true;
        whenSignedOut.hidden = false;
        codIDForm.hidden = true;
    }
});

function signIn() {
    auth.signInWithPopup(provider);
}

function signOut() {
    auth.signOut();
}

function updateAccount() {
    var accountName = document.getElementById('calldutyid');

    db.collection("users").doc(auth.currentUser.uid).set({
        gameIDAdded: true,
        gameID: accountName.value
    },{merge: true});
    
}