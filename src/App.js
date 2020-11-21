import React, { useRef, useState } from 'react';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/analytics';
import "firebase/database";
import './bootstrap.min.css';
import './custom.css';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { Button, Navbar, Nav, DropdownButton, Dropdown, Table } from 'react-bootstrap';

var firebaseConfig = {
  apiKey: "AIzaSyBs9ak1sWfPlFiBx6-VnJzi2Kn3s96ffF0",
  authDomain: "websitetournament.firebaseapp.com",
  databaseURL: "https://websitetournament.firebaseio.com",
  projectId: "websitetournament",
  storageBucket: "websitetournament.appspot.com",
  messagingSenderId: "537988314622",
  appId: "1:537988314622:web:c344f62e1fe1fe70e7bcaf"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const firestore = firebase.firestore();
const analytics = firebase.analytics();

function NavBar() {

  const [user] = useAuthState(auth);

  return (
  <>
    <Navbar bg="dark" variant="dark" expand="lg">
      <Navbar.Brand href="#">Warzone Tournament</Navbar.Brand>

      <Nav className="mr-auto">
        <Nav.Link className="waves-effect waves-light active" href="#home">Home</Nav.Link>
      </Nav>

      <section className="justify-content-end">
        {user ? <SignedIn /> : <SignIn />}
      </section>
      
    </Navbar>
  </>
  );
}

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return (
      <Button variant="primary" onClick={signInWithGoogle}>Sign In</Button>
  )
}

function SignedIn() {
  return (
    <>
      <DropdownButton id="dropdown-basic-button" title="Brett Saunders">
        <Dropdown.Item className="fas fa-user fa-sm fa-fw mr-2 text-gray-400" >Profile</Dropdown.Item>
        <Dropdown.Item className="fas fa-user fa-sm fa-fw mr-2 text-gray-400" >Settings</Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item className="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400" onclick={() => auth.signOut()}>Logout</Dropdown.Item>
      </DropdownButton>
    </>
  )
}

function Tournaments() {
  const tournamentsRef = firestore.collection('tournaments');
  const query = tournamentsRef.where('startTime', '<=', Math.floor(Date.now() / 1000)).orderBy('startTime');

  const [tournaments] = useCollectionData(query);

  return (<>
      {tournaments && tournaments.map(tournament => <ScoreboardTable tournamentData={tournament} />)}
    </>)
}

function ScoreboardTable(props) {
  const { name, roundNumber, startTime, endTime, positionsTable } = props.tournamentData;
  console.log(positionsTable);

  var startDate = new Date(startTime);
  var endDate = new Date(endTime);
  var size = 60 + (52 * Object.keys(positionsTable).length);
  var style = "height: "+size+"px;";

  return (
    <>
      <div class="leaderboard">
        <h1>
          <svg class="ico-cup"></svg>
          { name } - Round {roundNumber}
        </h1>
        <ol>
          {positionsTable && Object.keys(positionsTable).sort((a, b) => (positionsTable[a][5] < positionsTable[b][5]) ? 1 : -1).map(team => <ScoreboardRow positionData={positionsTable[team]} />)}
        </ol>
      </div>
    </>
  )
}

function ScoreboardRow(props) {
  var positionData = props.positionData.split(':');

  return (
    <>
      <li>
        <mark>{positionData[0]}</mark>
        <small>{positionData[5]}</small>
      </li>
  </>
  )
}


function App() {

  const [user] = useAuthState(auth);

  return (
    <div>
        <NavBar />
        <Tournaments />
    </div>
  );
}

export default App;
