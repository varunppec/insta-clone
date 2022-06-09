import Navigation from "./components/Navigation";
import style from "./styles/index.css";
import HomePageSignUp from "./components/HomePageSignUp";
import { FacebookAuthProvider } from "firebase/auth";
import { get, getDatabase, ref, set } from "firebase/database";
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
import {
  SignedInContext,
  DbContext,
  UserIDContext,
} from "./components/Context";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAheUFx9JHJ-oVLv9dKDHQRMFbv9wQrrm8",
  authDomain: "insta-clone-3ada4.firebaseapp.com",
  databaseURL:
    "https://insta-clone-3ada4-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "insta-clone-3ada4",
  storageBucket: "insta-clone-3ada4.appspot.com",
  messagingSenderId: "713251379457",
  appId: "1:713251379457:web:f928a27609de94c6a06300",
  measurementId: "G-8797P8S285",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase();

let imgsrc;

function App() {
  const [test, setTest] = useState("");
  const [user, setUser] = useState({});
  const [db, setDb] = useState(database);
  const userID = useRef("test");
  // const getDbData = async () => {
  //   const db = await get(ref(database, "users/"));
  //   setDb(value);
  // };

  useEffect(() => {
    printIt().then((value) => {
      let userid = localStorage.getItem('userid');
      if (value != null && userid) {
        console.log(userID.current);
        set(ref(db, "users/" + userid), {
          uid: value.user.uid,
          email: value.user.email,
        });
        setUser(value.user);
      }
    });
  }, []);

  useEffect(() => {
    let database = getDatabase();
    setDb(database);
    console.log("ran it");
  }, []);

  const printIt = async () => {
    const auth = getAuth();
    const result = await getRedirectResult(auth);

    console.log(result);
    return result;
  };
  return (
    <div className="App" style={style}>
      <DbContext.Provider value={db}>
        <SignedInContext.Provider value={user}>
          {/* <UserIDContext.Provider value={userID}> */}
          {user.uid ? (
            <Navigation />
          ) : (
            <HomePageSignUp userID={userID} setTest={setTest}></HomePageSignUp>
          )}
          {/* </UserIDContext.Provider> */}
        </SignedInContext.Provider>
      </DbContext.Provider>
    </div>
  );
}

export default App;
