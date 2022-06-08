<<<<<<< HEAD
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
=======
import Navigation from "./components/Navigation";
import style from "./styles/index.css";
import HomePageSignUp from "./components/HomePageSignUp";
import { FacebookAuthProvider } from "firebase/auth";
import {
  getAuth,
  signInWithRedirect,
  signInWithPopup,
  getRedirectResult,
} from "firebase/auth";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { useEffect, useRef, useState } from "react";
import { SignedInContext } from "./components/Context";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAheUFx9JHJ-oVLv9dKDHQRMFbv9wQrrm8",
  authDomain: "insta-clone-3ada4.firebaseapp.com",
  projectId: "insta-clone-3ada4",
  storageBucket: "insta-clone-3ada4.appspot.com",
  messagingSenderId: "713251379457",
  appId: "1:713251379457:web:f928a27609de94c6a06300",
  measurementId: "G-8797P8S285",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

let imgsrc;

const printIt = async () => {
  const auth = getAuth();
  const result = await getRedirectResult(auth);
  console.log(result);
  return result;
};

function App() {
  const [user, setUser] = useState({});
  useEffect(() => {
    printIt().then((value) => {
      console.log(value);
      if (value != null) {
        setUser(value.user);
      }
    });
  });
  return (
    <div className="App" style={style}>
      <SignedInContext.Provider value={user}>
        {user.uid ? <Navigation /> : <HomePageSignUp></HomePageSignUp>}
      </SignedInContext.Provider>
>>>>>>> 7e879d4 (Partial sign up page)
    </div>
  );
}

export default App;
