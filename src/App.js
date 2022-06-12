import Navigation from "./components/Navigation";
import style from "./styles/index.css";
import HomePageSignUp from "./components/HomePageSignUp";
import MyProfile from "./components/MyProfile";
import { FacebookAuthProvider } from "firebase/auth";
import { get, getDatabase, ref, set } from "firebase/database";
import { getFirestore, addDoc, collection } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import {
  getAuth,
  signInWithRedirect,
  signInWithPopup,
  getRedirectResult,
} from "firebase/auth";

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { useEffect, useRef, useState } from "react";
import {
  UserContext,
  DbContext,
  StoreContext,
  SetUserContext,
} from "./components/Context";
import HomePage from "./components/HomePage";

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
const testdb = getFirestore(app);
const storage = getStorage(app);

function App() {
  const [user, setUser] = useState({});
  const [db, setDb] = useState(database);

  useEffect(() => {
    printIt().then(async (value) => {
      const fun = () => {
        // console.log(user);
        // if (user.uid) return;
        let userid = localStorage.getItem("userid");
        let val = {
          name: value.user.displayName,
          uid: userid,
          usercode: value.user.uid,
          photo: value.user.photoURL,
          email: value.user.email,
          followers: ["daddy"],
          following: ["daddy"],
          posts: "",
        };
        if (value != null && userid) {
          console.log("asdfadsfa");
          set(ref(db, "users/" + userid), val);
          setUser(val);
        }
      };
      if (!value) return;
      let data = await get(ref(db, "users/"));
      data = data.val();
      Object.keys(data).forEach((key) => {
        console.log(data[key].usercode, value.user.uid);
        if (data[key].usercode === value.user.uid) {
          localStorage.setItem("userid", data[key].uid);
          console.log(key, data[key]);
          setUser(data[key], fun());
        }
      });
    });
  }, []);

  useEffect(() => {
    let database = getDatabase();
    setDb(database);
  }, []);

  const printIt = async () => {
    const auth = getAuth();
    const value = await getRedirectResult(auth);
    let userid = localStorage.getItem("userid");
    // let data = await get(ref(db, "users/"));
    //   data = data.val();
    //   Object.keys(data).forEach((key) => {
    //     console.log(data[key].usercode, value.user.uid);
    //     if (data[key].usercode === value.user.uid) {
    //       localStorage.setItem("userid", data[key].uid);
    //       console.log(key, data[key]);
    //       setUser(data[key]);

    //     }
    //   });
    
    return value;
  };
  return (
    <div className="App" style={style}>
      <DbContext.Provider value={db}>
        <UserContext.Provider value={user}>
          <StoreContext.Provider value={storage}>
            <SetUserContext.Provider value={setUser}>
              {user.uid ? (
                <>
                  <Navigation />
                  <HomePage />
                </>
              ) : (
                <>
                  <HomePageSignUp />
                </>
              )}
            </SetUserContext.Provider>
          </StoreContext.Provider>
        </UserContext.Provider>
      </DbContext.Provider>
    </div>
  );
}

export default App;
