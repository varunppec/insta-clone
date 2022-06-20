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
  ModalContext,
  SetModalContext
} from "./components/Context";
import HomePage from "./components/HomePage";
import ProfileSettings from "./components/ProfileSettings";
import { BrowserRouter, Routes, Route } from "react-router-dom";

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
  const [modalActive, setModalActive] = useState(false);
  const loggedIn = useRef(false);
  useEffect(() => {
    let database = getDatabase();
    setDb(database);
  }, []);
  useEffect(() => {
    if (localStorage.getItem("userid")) loggedIn.current = true;
    printIt();
  }, []);
  const printIt = async () => {
    const auth = getAuth();
    const value = await getRedirectResult(auth);
    if (!value && !localStorage.getItem("userid")) return;
    let userid = localStorage.getItem("userid");
    let data = await get(ref(db, "users/"));
    data = data.val();
    if (loggedIn.current === true) {
      setUser(data[localStorage.getItem("userid")]);
      return;
    }
    Object.keys(data).forEach(async (key) => {
      if (data[key].email === value.user.email) {
        localStorage.setItem("userid", data[key].uid);
        loggedIn.current = true;
        setUser(data[key]);
      }
    });
    if (loggedIn.current) return;
    let val = {
      name: value.user.displayName,
      uid: userid,
      usercode: value.user.uid,
      photo: value.user.photoURL,
      email: value.user.email,
      followers: ["daddy"],
      following: ["daddy"],
      posts: "",
      pp: "https://firebasestorage.googleapis.com/v0/b/insta-clone-3ada4.appspot.com/o/default_pp.jpg?alt=media&token=52c9c68a-5365-4dcd-9d7b-cda5457c86cb",
      bio: `Hey there! My name is ${value.user.displayName}. Stop stalking :(`,
    };
    if (value != null && userid) {
      console.log("asdfadsfa");
      set(ref(db, "users/" + userid), val);
      setUser(val);
    }

    return value;
  };
  return (
    <div className="App" style={style}>
      <BrowserRouter>
        <ModalContext.Provider value={modalActive}>
          <SetModalContext.Provider value={setModalActive}>
            <DbContext.Provider value={db}>
              <UserContext.Provider value={user}>
                <StoreContext.Provider value={storage}>
                  <SetUserContext.Provider value={setUser}>
                    <Routes>
                      <Route
                        path="/"
                        element={
                          user.uid ? (
                            <>
                              <Navigation />
                              <HomePage />
                            </>
                          ) : (
                            <>{<HomePageSignUp />}</>
                          )
                        }
                      ></Route>
                      <Route
                        path="/settings"
                        element={
                          <>
                            <Navigation />
                            <ProfileSettings />
                          </>
                        }
                      ></Route>
                      <Route
                        path="/profile"
                        element={
                          <>
                            <Navigation />
                            <MyProfile />
                          </>
                        }
                      >
                        <Route
                          path=":pid"
                          element={
                            <>
                              <Navigation />
                              <MyProfile />
                            </>
                          }
                        ></Route>
                      </Route>
                    </Routes>
                    {/* {user.uid ? (
                      <>
                        <Navigation />
                        <ProfileSettings />
                        <MyProfile />
                        <HomePage />
                      </>
                    ) : (
                      <>
                        <HomePageSignUp />
                      </>
                    )} */}
                  </SetUserContext.Provider>
                </StoreContext.Provider>
              </UserContext.Provider>
            </DbContext.Provider>
          </SetModalContext.Provider>
        </ModalContext.Provider>
      </BrowserRouter>
    </div>
  );
}

export default App;
