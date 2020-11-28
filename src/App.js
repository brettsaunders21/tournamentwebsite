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
import { Button, Navbar, Nav, DropdownButton, Dropdown, Table, Container } from 'react-bootstrap';

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
    // const provider = new firebase.auth.GoogleAuthProvider();
    // auth.signInWithPopup(provider);
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
  const query = tournamentsRef.where('startTime', '<=', Math.floor(Date.now() / 1000)).orderBy('startTime', "desc");

  const [tournaments] = useCollectionData(query);

  return (<>
      {tournaments && tournaments.map(tournament => <ScoreboardTable tournamentData={tournament} />)}
    </>)
}

function ScoreboardTable(props) {
  const { name, roundNumber, startTime, endTime, positionsTable } = props.tournamentData;
  //var positionKeys = Object.keys(positionsTable).sort((a, b) => (positionsTable[a][1] < positionsTable[b][1]) ? -1 : 1);
  var keysSorted = Object.keys(positionsTable).sort(function(a,b){
    var aSplit = positionsTable[a].split(':');
    var bSplit = positionsTable[b].split(':');
    return bSplit[5]- aSplit[5];
  })

  var boardData = [];
  keysSorted.forEach((key) => {
    boardData.push(positionsTable[key]);
  });


  return (
    <>
      <Container fluid="md">
        <Table hover responsive className="scores">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">{ name } - Round {roundNumber}</th>
              <th scope="col">Win Score</th>
              <th scope="col">Kills Score</th>
              <th scope="col">Total</th>
            </tr>
          </thead>
          <tbody>
            {boardData && boardData.map(team => <ScoreboardRow positionData={team} />)}
          </tbody>
        </Table>
      </Container>
    </>
  )
}

function ScoreboardRow(props) {
  var positionData = props.positionData.split(':');

  var posDiff =  positionData[2] - positionData[1];
  var srcImg = "https://www.dropbox.com/s/48bpk4g7ips4z43/same.png?raw=1";

  if (posDiff > 2) {
    srcImg = "https://www.dropbox.com/s/567wbjcxx4juzth/Increase2.png?raw=1";
  } else if (posDiff > 0) {
    srcImg = "https://www.dropbox.com/s/gn0c2tgkjtpytfn/Increase1.png?raw=1";
  } else if (posDiff == 0) {
    srcImg = "https://www.dropbox.com/s/48bpk4g7ips4z43/same.png?raw=1";
  } else if (posDiff < -2) {
    srcImg = "https://www.dropbox.com/s/s91k4vibsn647y0/decrease2.png?raw=1";
  } else {
    srcImg = "https://www.dropbox.com/s/d1ybbcahx73o5k5/decrease1.png?raw=1";
  }

  return (
    <>
      <tr>
        <td scope="row"><img src={srcImg} width="24" height="24" alt=""></img>   {positionData[1]}</td>
        <td>{positionData[0]}</td>
        <td>{positionData[3]}</td>
        <td>{positionData[4]}</td>
        <td>{positionData[5]}</td>
      </tr>
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
