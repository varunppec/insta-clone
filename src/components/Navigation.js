import {
  HomeRounded as HomeOutlined,
  ChatBubble as InboxOutlined,
  FavoriteRounded as Favorite,
  PersonRounded as Person,
} from "@material-ui/icons";
import { get, ref } from "firebase/database";
import { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { DbContext, UserContext } from "./Context";
const Navigation = () => {
  const navigate = useNavigate();
  const db = useContext(DbContext);
  const user = useContext(UserContext);
  const [searchItems, setSearchItems] = useState({});
  const [boxHeight, setBoxHeight] = useState({});
  const setHeight = () => {
    document.querySelector(".menubox").style.height = boxHeight + "px";
  };

  useEffect(() => {
    if (document.querySelector(".menuitems")) {
      setBoxHeight(document.querySelector(".menuitems").clientHeight);
      document.querySelector(".menubox").style.height = boxHeight + "px";
      console.log(document.querySelector(".menuitems").clientHeight);
    }
  }, [searchItems]);
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
      if (x.includes(searchInput)) {
        list.push({
          name: x,
          uid: useridArray[index],
          photo: profileData[useridArray[index]].photo,
        });
      }
    });
    console.log(list);
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
          // onBlur={() => setSearchItems({})}
          type="text"
          placeholder="Search"
        />

        {searchItems.length ? (
          <>
            <div className="navarrow"></div>
            <div className="menubox"></div>
            <div
              className="menuitems"
              onLoad={() => {
                console.log("loaded");
              }}
            >
              {searchItems
                .filter((x, index) => index < 5)
                .map((x) => {
                  return (
                    <div onClick={() => navigate(`/profile/${x.uid}`)}>
                      <div>
                        <img
                          src={x.photo}
                          width="25px"
                          height="25px"
                          alt=""
                        ></img>
                        <div>{x.name}</div>
                      </div>
                      <div>@{x.uid}</div>
                    </div>
                  );
                })}
            </div>
          </>
        ) : null}
      </div>
      <div className="navicons">
        <HomeOutlined onClick={() => navigate("/")}></HomeOutlined>
        <InboxOutlined></InboxOutlined>
        <Favorite></Favorite>
        <Person onClick={() => navigate("/profile")}></Person>
      </div>
    </nav>
  );
};

export default Navigation;
