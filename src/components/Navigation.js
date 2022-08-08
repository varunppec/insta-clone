import {
  HomeRounded as HomeOutlined,
  ChatBubble as InboxOutlined,
  PersonRounded as Person,
  FavoriteRounded,
  DarkMode,
  AccountCircleRounded,
  LogoutRounded,
} from "@mui/icons-material";
import { getAuth, signOut } from "firebase/auth";
import { get, getDatabase, ref } from "firebase/database";
import { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  DbContext,
  SetThemeContext,
  SetUserContext,
  ThemeContext,
  UserContext,
} from "./Context";
import uniqid from "uniqid";
import Skeleton from "react-loading-skeleton";

const getCommentTimeDiff = (commTime) => {
  let time = new Date().getTime() - commTime;
  let test = 0;
  test = Math.floor(time / (1000 * 60 * 60 * 24 * 7 * 4 * 12));
  if (test !== 0) {
    return `${test}y`;
  }
  test = Math.floor(time / (1000 * 60 * 60 * 24 * 7 * 4));
  if (test !== 0) {
    return `${test}mon`;
  }
  test = Math.floor(time / (1000 * 60 * 60 * 24 * 7));
  if (test !== 0) {
    return `${test}w`;
  }
  test = Math.floor(time / (1000 * 60 * 60 * 24));
  if (test !== 0) {
    return `${test}d`;
  }
  test = Math.floor(time / (1000 * 60 * 60));
  if (test !== 0) {
    return `${test}h`;
  }
  test = Math.floor(time / (1000 * 60));
  if (test !== 0) {
    return `${test}min`;
  }
  test = Math.floor(time / 1000);
  if (test !== 0) {
    return `${test}s`;
  }
  return `now`;
};

const Navigation = () => {
  const navigate = useNavigate();
  const db = useContext(DbContext);
  const user = useContext(UserContext);
  const setUser = useContext(SetUserContext);
  const [searchItems, setSearchItems] = useState({});
  const [boxHeight, setBoxHeight] = useState({});
  const [notification, setNotification] = useState(false);
  const [profilePopup, setProfilePopup] = useState(false);
  const clickOutsideRef = useRef();
  const clickOutsideNotifRef = useRef();
  const theme = useContext(ThemeContext);
  const setTheme = useContext(SetThemeContext);
  useEffect(() => {
    const checkOutsideClick = (e) => {
      if (
        notification &&
        clickOutsideNotifRef.current &&
        !clickOutsideNotifRef.current.contains(e.target)
      )
        setNotification(false);

      return () => {
        document.removeEventListener("click", checkOutsideClick);
      };
    };
    const checkOutsideClickProfile = (e) => {
      if (
        profilePopup &&
        clickOutsideRef.current &&
        !clickOutsideRef.current.contains(e.target)
      )
        setProfilePopup(false);

      return () => {
        document.removeEventListener("click", checkOutsideClickProfile);
      };
    };
    document.addEventListener("click", checkOutsideClick);
    document.addEventListener("click", checkOutsideClickProfile);

    // checkOutsideClick();
  }, [notification, profilePopup]);

  const signUserOut = async () => {
    localStorage.removeItem("userid");
    const auth = await getAuth();
    await signOut(auth);
    setUser({});
    navigate("/");
  };
  const searchProfile = async (e) => {
    if (e.target.value === "") {
      setSearchItems({});
      return;
    }

    let list = [];
    let profileData = await (await get(ref(db, "users/"))).val();
    const ind = Object.keys(profileData).indexOf(user.uid);
    let useridArray = Object.keys(profileData);
    useridArray.splice(ind, 1);
    const usernameArray = useridArray.map((x) => profileData[x].name);
    const searchInput = e.target.value;
    useridArray.forEach((x, index) => {
      if (x.includes(searchInput)) {
        list.push({
          name: usernameArray[index],
          uid: x,
          photo: profileData[x].photo,
        });
      }
    });
    usernameArray.forEach((x, index) => {
      if (x.toLowerCase().includes(searchInput)) {
        list.push({
          name: x,
          uid: useridArray[index],
          photo: profileData[useridArray[index]].photo,
        });
      }
    });
    let result = list.reduce((unique, o) => {
      if (!unique.some((obj) => obj.uid === o.uid)) {
        unique.push(o);
      }
      return unique;
    }, []);
    setSearchItems(result);
  };

  return (
    <nav>
      <div className="navhead" onClick={() => navigate("/")}>
        <div>Instagram</div>
      </div>
      <div className="navinput searchmenu">
        <input
          onInput={(e) => {
            searchProfile(e);
          }}
          onBlur={(e) => {
            setSearchItems({});
          }}
          type="text"
          placeholder="Search"
        />

        {searchItems.length ? (
          <>
            <div className="menubox">
              <div className="navarrow"></div>
              <div className="menuitems">
                {searchItems
                  .filter((x, index) => index < 5)
                  .map((x) => {
                    return (
                      <div
                        key={uniqid()}
                        onMouseDown={(e) => {
                          e.stopPropagation();
                          console.log("clicked");
                          navigate(`/profile/${x.uid}`);
                        }}
                      >
                        <div>
                          <img
                            src={x.photo}
                            width="25px"
                            height="25px"
                            alt=""
                          ></img>
                          <div>{x.name || <Skeleton />}</div>
                        </div>
                        <div>{"@" + x.uid || <Skeleton />}</div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </>
        ) : null}
      </div>
      <div className="navicons">
        <HomeOutlined
          className={window.location.pathname === "/" ? "iconactive" : ""}
          onClick={() => navigate("/")}
        ></HomeOutlined>{" "}
        
        <InboxOutlined
          className={
            window.location.pathname === "/messages" ? "iconactive" : ""
          }
          onClick={() => navigate("/messages")}
        ></InboxOutlined>{" "}
        <div className="heartclick">
          <FavoriteRounded
            ref={clickOutsideNotifRef}
            onClick={() => {
              setNotification(!notification);
            }}
            className={notification ? "iconactive" : null}
          />{" "}
          {notification
            ? <Notification setNotification={setNotification} />
            : null}
        </div>
        <div className="personclick">
          <Person
            className={profilePopup ? "iconactive" : null}
            ref={clickOutsideRef}
            onClick={() => {
              setProfilePopup(!profilePopup);
            }}
          ></Person>{" "}
          {profilePopup ? (
            <div className="popup">
              <div onClick={() => navigate("/profile")}>
                <AccountCircleRounded />
                <div>My Profile</div> 
              </div>
              <div
                onClick={() => {
                  signUserOut();
                }}
              >
                <LogoutRounded />
                <div>Logout</div> 
              </div>
            </div>
          ) : null}
        </div>
        <DarkMode onClick={() => setTheme(!theme)} />
      </div>
    </nav>
  );
};

const Notification = ({ setNotification }) => {
  const [notifs, setNotifs] = useState([]);
  const [read, setRead] = useState(false);
  const user = useContext(UserContext);
  const db = useContext(DbContext);
  const navigate = useNavigate();
  const getData = async () => {
    let data = await (await get(ref(db, `notifications/${user.uid}`))).val();
    console.log(data);
    if (data !== null) setNotifs(data.notifs);
    if (!data || !data.read) setRead(false);
    else setRead(true);
  };
  useEffect(() => {
    getData();
  }, []);
  return (
    <div className="popup">
      {notifs.length ? (
        notifs
          .slice(0, 4)
          .sort((a, b) => {
            if (a.time < b.time) return true;
            else return false;
          })
          .map((x) => {
            if (x.type === "like") {
              console.log("here");
              return (
                <div
                  key={uniqid()}
                  onClick={() => {
                    setNotification(false);
                    navigate(`/posts/${user.uid}/${x.url}`);
                  }}
                >
                  <div>
                    <span>{x.by}</span> liked your post
                  </div>
                  <div>{getCommentTimeDiff(x.time)}</div>
                </div>
              );
            } else if (x.type === "comment") {
              console.log("here");
              return (
                <div
                  key={uniqid()}
                  onClick={() => {
                    setNotification(false);
                    navigate(`/posts/${user.uid}/${x.url}`);
                  }}
                >
                  <div>
                    <span>{x.by}</span> commented on your post
                  </div>
                  <div>{getCommentTimeDiff(x.time)}</div>
                </div>
              );
            } else if (x.type === "follow") {
              console.log("here");
              return (
                <div
                  onClick={() => {
                    setNotification(false);
                    navigate(`/profile/${x.url}`);
                  }}
                >
                  <div>
                    <span>{x.by}</span> followed you
                  </div>
                  <div>{getCommentTimeDiff(x.time)}</div>
                </div>
              );
            } else {
              console.log("here");
              return (
                <div
                  onClick={() => {
                    setNotification(false);
                    navigate(`/messages`);
                  }}
                >
                  <div>
                    <span>{x.by}</span> messaged you
                  </div>
                  <div>{getCommentTimeDiff(x.time)}</div>
                </div>
              );
            }
          })
      ) : (
        <div>No notifications</div>
      )}
    </div>
  );
};

export default Navigation;
