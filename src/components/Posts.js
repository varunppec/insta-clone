import {
  FavoriteBorder as Favorite,
  CommentOutlined as Comment,
  SendOutlined as Send,
  ShareOutlined as Share,
  FavoriteRounded,
} from "@material-ui/icons";
import { get, ref, set } from "firebase/database";
import { useState } from "react";
import { useContext } from "react";
import {
  SetUserContext,
  UserContext,
  DbContext,
  SetPostDataContext,
} from "./Context";
import uniqid from "uniqid";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CopyToClipboard from "react-copy-to-clipboard";

const getTimeDiff = (postTime) => {
  let time = new Date().getTime() - postTime;
  let test = 0;
  test = Math.floor(time / (1000 * 60 * 60 * 24 * 7 * 4 * 12));
  if (test !== 0) {
    return test === 1 ? `${test} YEAR AGO` : `${test} YEARS AGO`;
  }
  test = Math.floor(time / (1000 * 60 * 60 * 24 * 7 * 4));
  if (test !== 0) {
    return test === 1 ? `${test} MONTH AGO` : `${test} MONTHS AGO`;
  }
  test = Math.floor(time / (1000 * 60 * 60 * 24 * 7));
  if (test !== 0) {
    return test === 1 ? `${test} WEEK AGO` : `${test} WEEKS AGO`;
  }
  test = Math.floor(time / (1000 * 60 * 60 * 24));
  if (test !== 0) {
    return test === 1 ? `${test} DAY AGO` : `${test} DAYS AGO`;
  }
  test = Math.floor(time / (1000 * 60 * 60));
  if (test !== 0) {
    return test === 1 ? `${test} HOUR AGO` : `${test} HOURS AGO`;
  }
  test = Math.floor(time / (1000 * 60));
  if (test !== 0) {
    return test === 1 ? `${test} MINUTE AGO` : `${test} MINUTES AGO`;
  }
  test = Math.floor(time / 1000);
  if (test !== 0) {
    return test === 1 ? `${test} SECOND AGO` : `${test} SECONDS AGO`;
  }
  return `JUST NOW`;
};

const Posts = () => {
  const db = useContext(DbContext);
  const userContext = useContext(UserContext);
  const setUserContext = useContext(SetUserContext);
  const [post, setPost] = useState({});
  const [profile, setProfile] = useState({});
  const { uid, pid } = useParams();
  const navigate = useNavigate();
  const [emptyVal, setEmptyVal] = useState("");
  const setPostData = useContext(SetPostDataContext);

  const getData = async () => {
    let data = await (await get(ref(db, `users/${uid}/posts/`))).val();
    console.log(profile, uid);
    let status = 0;
    for (let ele of data) {
      console.log("1st", ele.postLink === pid && profile.uid !== uid);
      console.log("2nd", ele.postLink === pid && profile.uid === uid);
      if (ele.postLink === pid && profile.uid !== uid) {
        console.log("set");
        status = 1;
        let profileDetails = await (await get(ref(db, `users/${uid}`))).val();
        setProfile(profileDetails);
        setPost(ele);
        return;
      } else if (ele.postLink === pid && profile.uid === uid) {
        status = 2;
        console.log("haah");
        return;
      }
    }
    if (status === 0) {
      console.log("navigated");
      navigate("/profile");
    }
    // get(ref(db, `users/${uid}/posts/`))
    //   .then(async (snap) => snap.val())
    //   .then(async (x) => {
    //     for (let ele of x) {
    //       console.log(ele.postLink, pid, profile.uid === uid);
    //       if (ele.postLink === pid && profile.uid !== uid) {
    //         let profileDetails = await (
    //           await get(ref(db, `users/${uid}`))
    //         ).val();
    //         setProfile(profileDetails);
    //         setPost(ele);
    //         console.log("set");
    //         return;
    //       } else if (ele.postLink === pid && profile.uid === uid) {
    //         console.log("haah");
    //         return;
    //       } else {
    //         navigate("/profile");
    //       }
    //     }
    //   });
  };

  useEffect(() => {
    getData();
  }, []);

  const getPostData = async () => {
    let arr = [];

    for (let x of userContext.following) {
      let data = await (await get(ref(db, `users/${x}/`))).val();
      if (data.posts && data.posts.length) {
        for (let y of data.posts) {
          y.photo = data.photo;
          y.name = data.name;
          y.uid = data.uid;
          arr.push(y);
        }
      }
    }
    userContext.posts.forEach((x) => {
      x.photo = userContext.photo;
      x.name = userContext.name;
      x.uid = userContext.uid;
      arr.push(x);
    });
    arr.sort((a, b) => (a.time < b.time ? 1 : -1));
    console.log("here 3");
    setPostData(arr);
  };
  const shareClicked = () => {
    const element = document.querySelector(".sharetooltiptext");
    element.style.opacity = 1;
    element.style.visibility = "visible";
    setInterval(() => {
      element.style.opacity = 0;
      element.style.visibility = "hidden";
    }, 3000);
  };

  const favClicked = async () => {
    let data = await (await get(ref(db, `users/${profile.uid}`))).val();
    if (post.likes && post.likes.includes(userContext.uid)) {
      post.likes.splice(post.likes.indexOf(userContext.uid), 1);
    } else if (post.likes && !post.likes.includes(userContext.uid)) {
      post.likes.push(userContext.uid);
    } else {
      post.likes = [userContext.uid];
    }
    let ind;
    data.posts.forEach((x, index) => {
      if (x.postLink === post.postLink) ind = index;
    });
    data.posts[ind] = post;
    await set(ref(db, `users/${profile.uid}`), data);
    await getPostData();
    if (profile.uid === userContext.uid) setUserContext(data);
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
              type: "like",
              url: post.postLink,
              time: new Date().getTime(),
            },
          ]
        : [
            {
              by: userContext.uid,
              type: "like",
              url: post.postLink,
              time: new Date().getTime(),
            },
          ],
    };
    console.log(newNotifData);
    await set(ref(db, `notifications/${profile.uid}/`), newNotifData);
    setProfile(data);
  };
  const submitComment = async () => {
    const comment = document.querySelector("#comment").value;
    let data = await (await get(ref(db, `users/${profile.uid}`))).val();

    post.comments = post.comments
      ? post.comments.length
        ? [
            ...post.comments,
            {
              uid: userContext.uid,
              comment: comment,
              photo: data.photo,
              time: new Date().getTime(),
            },
          ]
        : [
            {
              uid: userContext.uid,
              comment: comment,
              photo: data.photo,
              time: new Date().getTime(),
            },
          ]
      : [
          {
            uid: userContext.uid,
            comment: comment,
            photo: data.photo,
            time: new Date().getTime(),
          },
        ];

    let ind;
    data.posts.forEach((x, index) => {
      if (x.postLink === post.postLink) ind = index;
    });
    data.posts[ind] = post;
    await set(ref(db, `users/${profile.uid}`), data);
    if (userContext.uid !== profile.uid) {
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
                type: "comment",
                url: post.postLink,
                time: new Date().getTime(),
              },
            ]
          : [
              {
                by: userContext.uid,
                type: "comment",
                url: post.postLink,
                time: new Date().getTime(),
              },
            ],
      };
      console.log(newNotifData);
      await set(ref(db, `notifications/${profile.uid}/`), newNotifData);
    }
    if (profile.uid === userContext.uid) setUserContext(data);
    setProfile(data);
    setEmptyVal("");
  };

  const enablePostButton = (e) => {
    const post = document.querySelector("#post");
    if (e.target.value) {
      post.removeAttribute("disabled");
      post.classList.remove("disabled");
      document.querySelector("#post").onclick = () => submitComment();
    } else {
      post.setAttribute("disabled", "");
      post.classList.add("disabled");
    }
  };

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

  const handleChange = (e) => {
    if (e) setEmptyVal(e.target.val);
  };
  if (userContext.name)
    return (
      <div className="postholder">
        <div className="post">
          <div className="imgholder">
            <img src={post.url} alt=""></img>
          </div>
          <div className="postinfo">
            <div className="postuploader">
              <div className="postuserholder">
                <div className="postuser">
                  <img src={profile.photo} alt="" />
                  <div className="postuserinfo">
                    <h1>{profile.name}</h1>
                    <div>@{profile.uid}</div>
                  </div>
                </div>
                <div className="postcaption">{post.caption}</div>
              </div>
            </div>
            <div className="postcomments">
              {post.comments ? (
                post.comments.length ? (
                  post.comments.map((x) => {
                    return (
                      <div key={uniqid()}>
                        <img src={x.photo} alt=""></img>
                        <div>
                          <div>{x.uid}</div>
                          {x.comment}
                        </div>
                        <div>{getCommentTimeDiff(x.time)}</div>
                      </div>
                    );
                  })
                ) : (
                  <div className="nocomments">No comments</div>
                )
              ) : (
                <div className="nocomments">No comments</div>
              )}
            </div>
            <div className="postbuttons">
              {post.likes ? (
                post.likes.includes(userContext.uid) ? (
                  <FavoriteRounded
                    className="favclicked"
                    onClick={favClicked}
                  />
                ) : (
                  <Favorite onClick={favClicked} />
                )
              ) : (
                <Favorite onClick={favClicked} />
              )}
              <Comment
                onClick={() => {
                  const id = document.querySelector("#comment");
                  id.value = "";
                  id.focus();
                }}
              />
              <div className="sharetooltip">
                <CopyToClipboard
                  text={
                    window.location.href +
                    "posts/" +
                    profile.uid +
                    "/" +
                    post.postLink
                  }
                >
                  <Share onClick={() => shareClicked()}></Share>
                </CopyToClipboard>
                <div className={"sharetooltiptext sharetooltiptext"}>
                  Copied to clickboard
                </div>
              </div>
            </div>
            <div className="postextrainfo">
              <div>{post.likes ? post.likes.length : 0} likes</div>
              <div>{getTimeDiff(post.time)}</div>
            </div>
            <div className="addcomment">
              <textarea
                id="comment"
                onInput={(e) => enablePostButton(e)}
                maxLength="100"
                placeholder="Add a comment..."
                value={emptyVal}
                onChange={handleChange}
              ></textarea>
              <button disabled id="post" className="disabled">
                Post
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  else return <div>Loading</div>;
};

export { Posts };
export { getTimeDiff };
