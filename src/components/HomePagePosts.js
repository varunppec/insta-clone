import { get, ref, set } from "firebase/database";
import { useEffect } from "react";
import { useContext, useState } from "react";
import {
  DbContext,
  PostDataContext,
  SetPostDataContext,
  UserContext,
} from "./Context";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import uniqid from "uniqid";
import {
  MoreHoriz,
  FavoriteBorder as Favorite,
  FavoriteRounded,
  CommentOutlined as Comment,
  ShareOutlined as Share,
  SentimentDissatisfiedSharp,
  CloseOutlined,
} from "@material-ui/icons";
import { getTimeDiff } from "./Posts";
import { useNavigate } from "react-router-dom";
import CopyToClipboard from "react-copy-to-clipboard";

const HomePagePosts = () => {
  const user = useContext(UserContext);
  const [emptyVal, setEmptyVal] = useState("");
  const postData = useContext(PostDataContext);
  const setPostData = useContext(SetPostDataContext);
  const db = useContext(DbContext);
  const navigate = useNavigate();

  const viewProfile = (num) => {
    console.log("clicked");
    const element = document.querySelector(".viewprofile" + num);
    console.log(element);
    element.style.visibility = "visible";
    element.style.opacity = 1;
  };

  const closeViewProfile = (num) => {
    console.log("clicked");
    const element = document.querySelector(".viewprofile" + num);
    element.style.visibility = "hidden";
    element.style.opacity = 0;
  };
  const shareClicked = (num) => {
    const element = document.querySelector(".sharetooltiptext" + num);
    element.style.opacity = 1;
    element.style.visibility = "visible";
    setInterval(() => {
      element.style.opacity = 0;
      element.style.visibility = "hidden";
    }, 3000);
  };
  const handleChange = (e) => {
    if (e) setEmptyVal(e.target.val);
  };
  const submitComment = async (post, num) => {
    const comment = document.querySelector(`#comment${num}`).value;
    let data = await (await get(ref(db, `users/${post.uid}`))).val();

    post.comments = post.comments
      ? post.comments.length
        ? [
            ...post.comments,
            {
              uid: user.uid,
              comment: comment,
              photo: data.photo,
              time: new Date().getTime(),
            },
          ]
        : [
            {
              uid: user.uid,
              comment: comment,
              photo: data.photo,
              time: new Date().getTime(),
            },
          ]
      : [
          {
            uid: user.uid,
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
    await set(ref(db, `users/${post.uid}`), data);
    let val = [...postData];
    val[num] = post;

    let notifData = await (
      await get(ref(db, `notifications/${post.uid}`))
    ).val();
    let newNotifData = {
      read: false,
      notifs: notifData
        ? [
            ...notifData.notifs,
            {
              by: user.uid,
              type: "comment",
              url: post.postLink,
              time: new Date().getTime(),
            },
          ]
        : [
            {
              by: user.uid,
              type: "comment",
              url: post.postLink,
              time: new Date().getTime(),
            },
          ],
    };
    console.log(newNotifData);
    await set(ref(db, `notifications/${post.uid}/`), newNotifData);

    setPostData(val);
    setEmptyVal("");
  };

  const enablePostButton = (e, x, num) => {
    const post = document.querySelector(`#post${num}`);
    if (e.target.value) {
      post.removeAttribute("disabled");
      post.classList.remove("disabled");
      document.querySelector(`#post${num}`).onclick = () =>
        submitComment(x, num);
    } else {
      post.setAttribute("disabled", "");
      post.classList.add("disabled");
    }
  };

  const favClicked = async (post, num) => {
    let data = await (await get(ref(db, `users/${post.uid}`))).val();
    if (post.likes && post.likes.includes(user.uid)) {
      post.likes.splice(post.likes.indexOf(user.uid), 1);
    } else if (post.likes && !post.likes.includes(user.uid)) {
      post.likes.push(user.uid);
    } else {
      post.likes = [user.uid];
    }
    let ind;
    data.posts.forEach((x, index) => {
      if (x.postLink === post.postLink) ind = index;
    });
    data.posts[ind] = post;
    await set(ref(db, `users/${post.uid}`), data);
    let val = [...postData];
    val[num] = post;
    if (user.uid !== post.uid) {
      let notifData = await (
        await get(ref(db, `notifications/${post.uid}`))
      ).val();
      let newNotifData = {
        read: false,
        notifs: notifData
          ? [
              ...notifData.notifs,
              {
                by: user.uid,
                type: "follow",
                url: post.postLink,
                time: new Date().getTime(),
              },
            ]
          : [
              {
                by: user.uid,
                type: "follow",
                url: post.postLink,
                time: new Date().getTime(),
              },
            ],
      };
      console.log(newNotifData);
      await set(ref(db, `notifications/${post.uid}/`), newNotifData);
    }

    setPostData(val);
  };

  const getPostData = async () => {
    let arr = [];

    for (let x of user.following) {
      let data = await (await get(ref(db, `users/${x}/`))).val();
      console.log(data.posts);
      if (data.posts && data.posts.length) {
        for (let y of data.posts) {
          y.photo = data.photo;
          y.name = data.name;
          y.uid = data.uid;
          arr.push(y);
          console.log(y.likes);
        }
      }
    }
    if (user.posts)
      user.posts.forEach((x) => {
        x.photo = user.photo;
        x.name = user.name;
        x.uid = user.uid;
        arr.push(x);
      });
    arr.sort((a, b) => (a.time < b.time ? 1 : -1));
    console.log("here 2");
    console.log(arr);
    setPostData(arr);
  };
  useEffect(() => {
    getPostData();
  }, [user.posts.length]);
  //   getPostData();
  if (!postData || !postData.length) getPostData();

  if (postData && postData.length) {
    return (
      <div className="homepagegrid">
        {postData.map((x, index) => {
          return (
            <div key={uniqid()} className="homepagepost">
              <div>
                <img
                  onClick={() => navigate(`/profile/${x.uid}`)}
                  height="35px"
                  width="35px"
                  src={x.photo}
                  alt=""
                ></img>
                <div
                  onClick={() => navigate(`/profile/${x.uid}`)}
                  className="hppagepostuploadinfo"
                >
                  <div>{x.name}</div>
                  <div>@{x.uid}</div>
                </div>
                <MoreHoriz onClick={() => viewProfile(index)} />
              </div>
              <img
                onClick={() => navigate(`/posts/${x.uid}/${x.postLink}`)}
                src={x.url}
                alt=""
              ></img>
              <div className="postbuttons">
                {x.likes ? (
                  x.likes.includes(user.uid) ? (
                    <FavoriteRounded
                      className="favclicked"
                      onClick={() => favClicked(x, index)}
                    />
                  ) : (
                    <Favorite onClick={() => favClicked(x, index)} />
                  )
                ) : (
                  <Favorite onClick={() => favClicked(x, index)} />
                )}
                <Comment
                  onClick={() => {
                    const id = document.querySelector(`#comment${index}`);
                    id.value = "";
                    id.focus();
                  }}
                />
                <div className="sharetooltip">
                  <CopyToClipboard
                    text={
                      window.location.href + "posts/" + x.uid + "/" + x.postLink
                    }
                  >
                    <Share onClick={() => shareClicked(index)}></Share>
                  </CopyToClipboard>
                  <div className={"sharetooltiptext sharetooltiptext" + index}>
                    Copied to clickboard
                  </div>
                </div>
              </div>
              <div className="postextrainfo">
                <div>{x.likes ? x.likes.length : 0} likes</div>
              </div>
              <div className="hppostcaption">
                <div>{x.uid}</div>
                <div>{x.caption}</div>
              </div>
              {x.comments && x.comments.length > 0 ? (
                <div
                  className="viewcomments"
                  onClick={() => navigate(`/posts/${x.uid}/${x.postLink}`)}
                >
                  View all comments
                </div>
              ) : null}

              <div className="somecomments">
                {x.comments && x.comments.length ? (
                  x.comments
                    .sort((a, b) => (a.time < b.time ? 1 : -1))
                    .map((com, index) => {
                      return index > 1 ? null : (
                        <div key={uniqid()}>
                          <div>{com.uid}</div>
                          <div>{com.comment}</div>
                        </div>
                      );
                    })
                ) : (
                  <div>No comments</div>
                )}
              </div>
              <div className="posttimeupload">{getTimeDiff(x.time)}</div>
              <div className="addcomment">
                <textarea
                  id={"comment" + index}
                  onInput={(e) => enablePostButton(e, x, index)}
                  maxLength="100"
                  placeholder="Add a comment..."
                  value={emptyVal}
                  onChange={handleChange}
                ></textarea>
                <button disabled id={"post" + index} className="disabled">
                  Post
                </button>
              </div>
              <div className={"viewprofile viewprofile" + index}>
                <CloseOutlined
                  onClick={() => {
                    console.log("clicked");
                    closeViewProfile(index);
                  }}
                />
                <div>
                  {x.uid === user.uid ? (
                    <button onClick={() => navigate("/profile")}>
                      Edit Profile
                    </button>
                  ) : (
                    <button onClick={() => navigate(`/profile/${x.uid}`)}>
                      View Profile
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  } else {
    return (
      <div className="homepagegrid">
        <SkeletonTheme baseColor="#202020" highlightColor="#444">
          <div key={uniqid()} className="homepagepost">
            <div>
              <div className="circle"></div>
              <div className="hppagepostuploadinfo">
                <div
                  className="rectangle"
                  style={{
                    width: "100px",
                    height: "15px",
                    marginBottom: "5px",
                  }}
                ></div>
                <div
                  className="rectangle"
                  style={{ width: "80px", height: "15px" }}
                ></div>
              </div>
              <div
                className="rectangle"
                style={{ width: "30px", height: "15px", marginLeft: "auto" }}
              ></div>
            </div>
            <div
              className="rectangle"
              style={{ width: "100%", height: "70%", borderRadius: "0" }}
            ></div>
            <div className="postbuttons">
              <div
                className="rectangle"
                style={{ width: "25px", height: "20px" }}
              ></div>
              <div
                className="rectangle"
                style={{ width: "25px", height: "20px" }}
              ></div>
              <div className="sharetooltip">
                <div
                  className="rectangle"
                  style={{ width: "25px", height: "20px" }}
                ></div>
              </div>
            </div>
            <div className="postextrainfo">
              <div
                className="rectangle"
                style={{ width: "100px", height: "20px", marginBottom: "5px" }}
              ></div>
            </div>
            <div className="hppostcaption">
              <div
                className="rectangle"
                style={{ width: "30px", height: "20px" }}
              ></div>
              <div
                className="rectangle"
                style={{ width: "180px", height: "20px" }}
              ></div>
            </div>
            <div className="somecomments">
              <div key={uniqid()}>
                <div
                  className="rectangle"
                  style={{ width: "180px", height: "20px", marginTop: "5px" }}
                ></div>
              </div>
            </div>
            <div className="posttimeupload">
              <div
                className="rectangle"
                style={{ width: "80px", height: "20px" }}
              ></div>
            </div>
            <div className="addcomment">
              <div
                className="rectangle"
                style={{ width: "180px", height: "20px" }}
              ></div>
              <div
                className="rectangle"
                style={{ width: "80px", height: "20px", marginLeft: "auto" }}
              ></div>
            </div>
            <div className={"viewprofile"}>
              <Skeleton />
              <div>
                <Skeleton></Skeleton>
              </div>
            </div>
          </div>
        </SkeletonTheme>
      </div>
    );
  }
};

export default HomePagePosts;
