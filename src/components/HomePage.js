import { get, ref, once, set } from "firebase/database";
import { useContext } from "react";
import uniqid from "uniqid";
import {
  DbContext,
  UserContext,
  PostModalContext,
  SetPostModalContext,
  FollowModalContext,
  SetFollowModalContext,
  SetFollowingClickContext,
} from "./Context";
import {
  AddCircleOutline,
  CloudUploadOutlined as CloudUpload,
  CloseOutlined,
} from "@material-ui/icons";

import PostModal from "./PostModal";
import FollowModal from "./FollowModal";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const postModalActive = useContext(PostModalContext);
  const setFollowingClick = useContext(SetFollowingClickContext);
  const setPostModalActive = useContext(SetPostModalContext);
  const followModalActive = useContext(FollowModalContext);
  const setFollowModalActive = useContext(SetFollowModalContext);
  const user = useContext(UserContext);
  const navigate = useNavigate();
  let dbRef = {};
  const dbContext = useContext(DbContext);
  get(ref(dbContext, "users/")).then((val) => (dbRef = val.val()));

  return (
    <div className="homepageholder">
      {postModalActive ? <PostModal /> : null}
      {followModalActive ? <FollowModal /> : null}
      <div></div>
      <div>
        <div className="userinfoholder">
          <div>
            <img src={user.photo} alt=""></img>
          </div>
          <div className="userinfo">
            <div>{user.name}</div>
            <div>{user.uid}</div>
          </div>
        </div>
        <div className="userstats">
          <div
            className="following"
            onClick={() => {
              setFollowModalActive(true);
              setFollowingClick(true);
            }}
          >
            <div>{user.following ? user.following.length : 0}</div>
            <div>Following</div>
          </div>
          <div
            className="followers"
            onClick={() => {
              setFollowModalActive(true);
              setFollowingClick(false);
            }}
          >
            <div>{user.followers.length ? user.followers.length : 0}</div>
            <div>Followers</div>
          </div>
          <div className="posts" onClick={() => navigate("/profile")}>
            <div>{user.posts && user.posts.length ? user.posts.length: 0}</div>
            <div>Posts</div>
          </div>
          <div
            className="newpost"
            onClick={() => {
              setPostModalActive(true);
            }}
          >
            <AddCircleOutline />
            <div>New Post</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
