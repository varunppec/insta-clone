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
import { SetUserContext, UserContext, DbContext } from "./Context";
import uniqid from "uniqid";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const Posts = () => {
  const db = useContext(DbContext);
  const userContext = useContext(UserContext);
  const setUserContext = useContext(SetUserContext);
  const [post, setPost] = useState({});
  const [profile, setProfile] = useState({});
  const { uid, pid } = useParams();
  const navigate = useNavigate();
  console.log(uid, pid);
  const [emptyVal, setEmptyVal] = useState("");
  console.log("rerendered");

  useEffect(() => {
    get(ref(db, `users/${uid}/posts/`))
      .then((snap) =>
        // console.log(snap.val())
        snap.val()
      )
      .then((x) => {
        x.forEach(async (ele) => {
          if (ele.postLink === pid && profile.uid !== uid) {
            let profileDetails = await (
              await get(ref(db, `users/${uid}`))
            ).val();
            setProfile(profileDetails);
            setPost(ele);
          } else if (ele.postLink === pid && profile.uid === uid) return;
          else navigate("/profile");
        });
      });
  }, []);

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
    setProfile(data);
    setEmptyVal("");
  };

  const enablePostButton = (e) => {
    const post = document.querySelector("#post");
    console.log(e.target.value ? true : false);
    if (e.target.value) {
      post.removeAttribute("disabled");
      post.classList.remove("disabled");
      document.querySelector("#post").onclick = () => submitComment();
    } else {
      post.setAttribute("disabled", "");
      post.classList.add("disabled");
    }
  };

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
              {/* <Favorite onClick={favClicked} /> */}
              <Comment
                onClick={() => {
                  const id = document.querySelector("#comment");
                  id.value = "";
                  id.focus();
                }}
              />
              <Share />
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

export default Posts;
