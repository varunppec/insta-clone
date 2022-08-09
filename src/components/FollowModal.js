import { CloseOutlined } from "@material-ui/icons";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import uniqid from "uniqid";
import { useContext } from "react";
import {
  DbContext,
  FollowingClickContext,
  FollowModalContext,
  SetFollowingClickContext,
  SetFollowModalContext,
  SetUserContext,
  UserContext,
} from "./Context";
import { get, ref, set } from "firebase/database";
import { async } from "@firebase/util";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const FollowModal = () => {
  const { pid } = useParams();
  const [profile, setProfile] = useState({});
  const userContext = useContext(UserContext);
  const setUser = useContext(SetUserContext);
  const db = useContext(DbContext);
  const followModalActive = useContext(FollowModalContext);
  const setFollowModalActive = useContext(SetFollowModalContext);
  const followingClick = useContext(FollowingClickContext);
  const setFollowingClick = useContext(SetFollowingClickContext);
  const [followingList, setFollowingList] = useState([]);
  const [followerList, setFollowerList] = useState([]);
  const navigate = useNavigate();

  if (pid && Object.keys(profile).length === 0) {
    get(ref(db, `users/${pid}`)).then((snap) => {
      if (snap.val() === null || pid === localStorage.getItem("userid")) {
        navigate("/profile");
      } else setProfile(snap.val());
    });
  }

  const user = Object.keys(profile).length ? profile : userContext;

  const unFollow = async (profile) => {
    let followerData = await (
      await get(ref(db, `users/${userContext.uid}`))
    ).val();
    followerData.following.splice(
      followerData.following.indexOf(profile.uid),
      1
    );
    await set(ref(db, `users/${userContext.uid}`), followerData);

    followerData = await (await get(ref(db, `users/${userContext.uid}`))).val();
    let followingData = await (
      await get(ref(db, `users/${profile.uid}`))
    ).val();
    followingData.followers.splice(
      followingData.followers.indexOf(useContext.uid),
      1
    );
    await set(ref(db, `users/${profile.uid}`), followingData);
    setUser(followerData);
  };

  const follow = async (profile) => {
    let followerData = await (
      await get(ref(db, `users/${userContext.uid}`))
    ).val();
    if (followerData.following) followerData.following.push(profile.uid);
    else followerData.following = [profile.uid];
    await set(ref(db, `users/${userContext.uid}`), followerData);
    let notifData = await (
      await get(ref(db, `notifications/${profile.uid}`))
    ).val();
    let newNotifData = {
      read: false,
      notifs: notifData
        ? [
            ...notifData.notifs,
            {
              by: userContext.uid,
              type: "follow",
              url: userContext.uid,
              time: new Date().getTime(),
            },
          ]
        : [
            {
              by: userContext.uid,
              type: "follow",
              url: userContext.uid,
              time: new Date().getTime(),
            },
          ],
    };
    await set(ref(db, `notifications/${profile.uid}/`), newNotifData);
    let followingData = await (
      await get(ref(db, `users/${profile.uid}`))
    ).val();
    if (followingData.followers) followingData.followers.push(userContext.uid);
    else followingData.followers = [userContext.uid];

    await set(ref(db, `users/${profile.uid}`), followingData);
    setUser(followerData);
  };

  useEffect(() => {
    const getInfo = async () => {
      let followingLis = [];
      let followerLis = [];
      let followingPromise = new Promise((resolve, reject) => {
        if (user.following)
          user.following.forEach(async (profile, index, array) => {
            let data = await (await get(ref(db, `users/${profile}`))).val();
            followingLis.push(data);
            if (index === array.length - 1) resolve();
          });
        else resolve();
      });
      followingPromise.then(() => {
        followingLis.sort((a, b) =>
          a.uid === userContext.uid ? 0 : a.uid < b.uid ? 0 : 1
        );

        setFollowingList(followingLis);
      });

      let followerPromise = new Promise((resolve, reject) => {
        if (user.followers)
          user.followers.forEach(async (profile, index, array) => {
            let data = await (await get(ref(db, `users/${profile}`))).val();
            followerLis.push(data);
            if (index === array.length - 1) resolve();
          });
        else resolve();
      });
      followerPromise.then(() => {
        followerLis.sort((a, b) =>
          a.uid === userContext.uid ? 0 : a.uid < b.uid ? 0 : 1
        );
        setFollowerList(followerLis);
      });
    };
    // setFollowingList([]);
    getInfo();
  }, [setUser, user]);

  if (user && user.uid)
    return (
      <div className="modal">
        <div className="followholder">
          <div>
            <div className="followheader">
              {followingClick ? (
                <>
                  <div className="followinghead active">Following</div>
                  <div
                    className="followershead"
                    onClick={() => setFollowingClick(false)}
                  >
                    Followers
                  </div>
                </>
              ) : (
                <>
                  <div
                    className="followinghead"
                    onClick={() => setFollowingClick(true)}
                  >
                    Following
                  </div>
                  <div className="followershead active">Followers</div>
                </>
              )}
              <CloseOutlined onClick={() => setFollowModalActive(false)} />
            </div>
            {followingClick ? (
              <div className="followlist">
                {followingList.length ? (
                  followingList.map((x) => {
                    if (x.uid === userContext.uid)
                      return (
                        <div
                          className="followingitems"
                          key={uniqid()}
                          onClick={(e) => {
                            setFollowModalActive(false);
                            navigate(`/profile/${x.uid}`);
                          }}
                        >
                          <img src={x.photo} alt=""></img>
                          <div>
                            <div>{x.name}</div>
                            <div>{x.uid}</div>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate("/settings");
                            }}
                          >
                            Edit Profile
                          </button>
                        </div>
                      );
                    else
                      return (
                        <div
                          className="followingitems"
                          key={uniqid()}
                          onClick={(e) => {
                            setFollowModalActive(false);
                            navigate(`/profile/${x.uid}`);
                          }}
                        >
                          <img src={x.photo} alt=""></img>
                          <div>
                            <div>{x.name}</div>
                            <div>{x.uid}</div>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              unFollow(x);
                            }}
                          >
                            Unfollow
                          </button>
                        </div>
                      );
                  })
                ) : (
                  <div className="nofollowing">Not following anyone</div>
                )}
              </div>
            ) : (
              <div className="followlist">
                {followerList.length ? (
                  followerList.map((x) => {
                    if (x.uid === userContext.uid)
                      return (
                        <div
                          className="followingitems"
                          key={uniqid()}
                          onClick={(e) => {
                            setFollowModalActive(false);
                            navigate(`/profile/${x.uid}`);
                          }}
                        >
                          <img src={x.photo} alt=""></img>
                          <div>
                            <div>{x.name}</div>
                            <div>{x.uid}</div>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate("/settings");
                            }}
                          >
                            Edit Profile
                          </button>
                        </div>
                      );
                    else
                      return (
                        <div
                          className="followingitems"
                          key={uniqid()}
                          onClick={(e) => {
                            setFollowModalActive(false);
                            navigate(`/profile/${x.uid}`);
                          }}
                        >
                          <img src={x.photo} alt=""></img>
                          <div>
                            <div>{x.name}</div>
                            <div>@{x.uid}</div>
                          </div>
                          {user.following ? (
                            user.following.includes(x.uid) ? (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  unFollow(x);
                                }}
                              >
                                Unfollow
                              </button>
                            ) : (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  follow(x);
                                }}
                              >
                                Follow
                              </button>
                            )
                          ) : (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                follow(x);
                              }}
                            >
                              Follow
                            </button>
                          )}
                          {/* <button onClick={() => unFollow(x)}>Unfollow</button> */}
                        </div>
                      );
                  })
                ) : (
                  <div className="nofollowing">No Followers</div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  else
    return (
      <div className="modal">
        <div className="followholder">
          <div>
            <div className="followheader">
              <>
                <div className="followinghead">Following</div>
                <div className="followershead">Followers</div>
              </>
              <CloseOutlined onClick={() => setFollowModalActive(false)} />
            </div>
            <div className="followlist">
              <div className="followingitems">
                <div
                  className="circle"
                  style={{
                    width: "60px",
                    height: "60px",
                    minWidth: "60px",
                    maxWidth: "60px",
                  }}
                ></div>
                <div>
                  <div
                    className="rectangle"
                    style={{
                      width: "150px",
                      height: "26px",
                    }}
                  ></div>
                  <div
                    className="rectangle"
                    style={{
                      width: "80px",
                      height: "20px",
                    }}
                  ></div>
                </div>
                <div
                  className="rectangle"
                  style={{
                    minWidth: "120px",
                    height: "45px",
                    borderRadius: "50px",
                    marginLeft: "auto",
                    marginRight: "5px",
                  }}
                ></div>
              </div>
              <div className="followingitems">
                <div
                  className="circle"
                  style={{
                    width: "60px",
                    height: "60px",
                    minWidth: "60px",
                    maxWidth: "60px",
                  }}
                ></div>
                <div>
                  <div
                    className="rectangle"
                    style={{
                      width: "150px",
                      height: "26px",
                    }}
                  ></div>
                  <div
                    className="rectangle"
                    style={{
                      width: "80px",
                      height: "20px",
                    }}
                  ></div>
                </div>
                <div
                  className="rectangle"
                  style={{
                    minWidth: "120px",
                    height: "45px",
                    borderRadius: "50px",
                    marginLeft: "auto",
                    marginRight: "5px",
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
};

export default FollowModal;
