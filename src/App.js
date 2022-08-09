import Navigation from "./components/Navigation";
import style from "./styles/index.css";
import HomePageSignUp from "./components/HomePageSignUp";
import MyProfile from "./components/MyProfile";
import { get, getDatabase, ref, set } from "firebase/database";
import { getStorage } from "firebase/storage";
import {
  getAuth,
  getRedirectResult,
  onAuthStateChanged,
  signInWithRedirect,
} from "firebase/auth";

import { initializeApp } from "firebase/app";
import { useEffect, useRef, useState } from "react";
import {
  UserContext,
  DbContext,
  StoreContext,
  SetUserContext,
  PostModalContext,
  SetPostModalContext,
  FollowModalContext,
  SetFollowModalContext,
  SetFollowingClickContext,
  FollowingClickContext,
  PostDataContext,
  SetPostDataContext,
  ThemeContext,
  SetThemeContext,
} from "./components/Context";
import HomePage from "./components/HomePage";
import ProfileSettings from "./components/ProfileSettings";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Posts } from "./components/Posts";
import Messages from "./components/Messages";
import { darkTheme, lightTheme } from "./styled-components/theme.style";
import { ThemeProvider } from "styled-components";
import { GlobalStyles } from "./styled-components/global.style";

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
const database = getDatabase();
const storage = getStorage(app);

function App() {
  const [user, setUser] = useState({});
  const [db, setDb] = useState(database);
  const [postModalActive, setPostModalActive] = useState(false);
  const [followModalActive, setFollowModalActive] = useState(false);
  const [followingClick, setFollowingClick] = useState(true);
  const [postData, setPostData] = useState({});
  const [theme, setTheme] = useState(true);

  useEffect(() => {
    let database = getDatabase();
    setDb(database);
  }, []);
  useEffect(() => {
    printIt();
  }, []);
  const printIt = async () => {
    let id = localStorage.getItem("userid");
    if (id) {
      let data = await (await get(ref(db, `users/${id}`))).val();
      if (data) setUser(data);
    }
  };
  if (user)
    return (
      <div className="App" style={style}>
        <BrowserRouter>
          <FollowingClickContext.Provider value={followingClick}>
            <SetFollowingClickContext.Provider value={setFollowingClick}>
              <FollowModalContext.Provider value={followModalActive}>
                <SetFollowModalContext.Provider value={setFollowModalActive}>
                  <PostModalContext.Provider value={postModalActive}>
                    <SetPostModalContext.Provider value={setPostModalActive}>
                      <DbContext.Provider value={db}>
                        <UserContext.Provider value={user}>
                          <StoreContext.Provider value={storage}>
                            <PostDataContext.Provider value={postData}>
                              <SetPostDataContext.Provider value={setPostData}>
                                <SetUserContext.Provider value={setUser}>
                                  <SetThemeContext.Provider value={setTheme}>
                                    <ThemeContext.Provider value={theme}>
                                      <ThemeProvider
                                        theme={theme ? lightTheme : darkTheme}
                                      >
                                        <GlobalStyles />
                                        <Routes>
                                          <Route
                                            path="/"
                                            element={
                                              !user.uid ? (
                                                <HomePageSignUp />
                                              ) : (
                                                <>
                                                  <Navigation />
                                                  <HomePage />
                                                </>
                                              )
                                            }
                                          ></Route>
                                          <Route
                                            path="/settings"
                                            element={
                                              !user.uid ? (
                                                <HomePageSignUp />
                                              ) : (
                                                <>
                                                  <Navigation />
                                                  <ProfileSettings />
                                                </>
                                              )
                                            }
                                          ></Route>
                                          <Route
                                            path="/messages"
                                            element={
                                              !user.uid ? (
                                                <HomePageSignUp />
                                              ) : (
                                                <>
                                                  <Navigation />
                                                  <Messages />
                                                </>
                                              )
                                            }
                                          ></Route>
                                          <Route
                                            path="/posts/:uid/:pid"
                                            element={
                                              !user.uid ? (
                                                <HomePageSignUp />
                                              ) : (
                                                <>
                                                  <Navigation />
                                                  <Posts />
                                                </>
                                              )
                                            }
                                          />
                                          <Route
                                            path="/profile"
                                            element={
                                              !user.uid ? (
                                                <HomePageSignUp />
                                              ) : (
                                                <>
                                                  <Navigation />
                                                  <MyProfile />
                                                </>
                                              )
                                            }
                                          >
                                            <Route
                                              path=":pid"
                                              element={
                                                !user.uid ? (
                                                  <HomePageSignUp />
                                                ) : (
                                                  <>
                                                    <Navigation />
                                                    <MyProfile />
                                                  </>
                                                )
                                              }
                                            ></Route>
                                          </Route>
                                          <Route
                                            path="*"
                                            element={
                                              !user.uid ? (
                                                <HomePageSignUp />
                                              ) : (
                                                <Navigate to="/"></Navigate>
                                              )
                                            }
                                          />
                                        </Routes>
                                      </ThemeProvider>
                                    </ThemeContext.Provider>
                                  </SetThemeContext.Provider>
                                </SetUserContext.Provider>
                              </SetPostDataContext.Provider>
                            </PostDataContext.Provider>
                          </StoreContext.Provider>
                        </UserContext.Provider>
                      </DbContext.Provider>
                    </SetPostModalContext.Provider>
                  </PostModalContext.Provider>
                </SetFollowModalContext.Provider>
              </FollowModalContext.Provider>
            </SetFollowingClickContext.Provider>
          </FollowingClickContext.Provider>
        </BrowserRouter>
      </div>
    );
  else return <div>Loading</div>;
}

export default App;
