import { useContext } from "react";
import { DbContext, SetUserContext, UserContext } from "./Context";
import uniqid from "uniqid";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef } from "react";
import { useState } from "react";
import { get, ref, set } from "firebase/database";
import { Send as Send } from "@material-ui/icons";

const MyProfile = () => {
  const [profile, setProfile] = useState({});
  const navigate = useNavigate();
  const setUser = useContext(SetUserContext);
  const db = useContext(DbContext);
  const { pid } = useParams();
  const userContext = useContext(UserContext);
  console.log('condition', pid, Object.keys(profile).length, userContext.uid)
  if (pid && Object.keys(profile).length === 0) {
    get(ref(db, `users/${pid}`)).then((snap) => {
      if (snap.val() === null || pid === localStorage.getItem("userid")) {
        console.log('navigated')
        navigate("/profile");
      } else setProfile(snap.val());
    });
  }
  const user = Object.keys(profile).length ? profile : userContext;

  const followFunction = async () => {
    if (
      userContext.following
        ? userContext.following.includes(profile.uid)
        : false
    ) {
      //unfollow
      let followerData = await (
        await get(ref(db, `users/${userContext.uid}`))
      ).val();
      followerData.following.splice(
        followerData.following.indexOf(profile.uid),
        1
      );
      set(ref(db, `users/${userContext.uid}`), followerData);

      let followingData = await (
        await get(ref(db, `users/${profile.uid}`))
      ).val();
      followingData.followers.splice(
        followingData.followers.indexOf(userContext.uid),
        1
      );
      set(ref(db, `users/${profile.uid}`), followingData);
      setUser(followerData);
      setProfile(followingData);
      // navigate(`/profile/${profile.uid}`);
      // navigate(`profile/${profile.uid}`);
    } else {
      //follow
      let followerData = await (
        await get(ref(db, `users/${userContext.uid}`))
      ).val();
      //
      if (followerData.following) followerData.following.push(profile.uid);
      else followerData.following = [profile.uid];
      set(ref(db, `users/${userContext.uid}`), followerData);

      let followingData = await (
        await get(ref(db, `users/${profile.uid}`))
      ).val();
      // followingData.followers.push(userContext.uid);
      if (followingData.followers)
        followingData.followers.push(userContext.uid);
      else followingData.followers = [userContext.uid];

      set(ref(db, `users/${profile.uid}`), followingData);
      setUser(followerData);
      setProfile(followingData);
      // navigate(`/profile/${profile.uid}`);
      // navigate(`/profile/${profile.uid}`);
    }
  };
  if (user.email && userContext.email) {
    console.log(pid, userContext.uid);
    return (
      <div className="myprofileholder">
        <div className="profileppholder">
          <img src={user.pp} alt=""></img>
        </div>
        <div className="profilebuttons">
          <div className="profilephoto">
            <img src={user.photo} alt=""></img>
          </div>
          {Object.keys(profile).length && pid !== userContext.uid && pid ? (
            <div className="profbuttons">
              <button onClick={followFunction}>
                {(
                  userContext.following
                    ? userContext.following.includes(profile.uid)
                    : false
                )
                  ? "Unfollow"
                  : "Follow"}
              </button>
              <button>
                <Send></Send>
              </button>
            </div>
          ) : (
            <div className="profbuttons">
              <button onClick={() => navigate("/settings")}>Edit Profile</button>
              <button>+</button>
            </div>
          )}
          {/* <div className="profbuttons">
            <button>Edit Profile</button>
            <button>+</button>
          </div> */}
        </div>
        <div className="profiledetails">
          <div className="sideprofile">
            <div className="basedetails">
              <div>{user.name}</div>
              <div>{user.uid}</div>
              <div>
                <h3>{user.posts ? user.posts.length : 0}</h3>
                <p>Posts</p>
              </div>
            </div>
            <div className="followinfo">
              <div>
                <h3>{user.following ? user.following.length : 0}</h3>
                <div>Following</div>
              </div>
              <div>
                <h3>{user.followers ? user.followers.length : 0}</h3>
                <div>Followers</div>
              </div>
            </div>
            <div className="bio">
              <h3>Bio</h3>
              <div>{user.bio}</div>
            </div>
          </div>
          <div className="postgrid">
            {user.posts
              ? user.posts.map((x) => {
                  return (
                    <div key={uniqid()}>
                      <img src={x.url} alt=""></img>
                    </div>
                  );
                })
              : null}
          </div>
        </div>
      </div>
    );
  } else return <div>Loading</div>;
};

export default MyProfile;
