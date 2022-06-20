import { get, ref, once, set } from "firebase/database";
import { useContext } from "react";
import uniqid from "uniqid";
import {
  DbContext,
  UserContext,
  StoreContext,
  SetUserContext,
  ModalContext,
  SetModalContext,
} from "./Context";
import {
  AddCircleOutline,
  CloudUploadOutlined as CloudUpload,
  CloseOutlined,
} from "@material-ui/icons";
import { useState } from "react";
import {
  getDownloadURL,
  getMetadata,
  listAll,
  ref as sref,
  uploadBytes,
} from "firebase/storage";
import ModalCreator from "./ModalCreator";

const HomePage = () => {
  const modalActive = useContext(ModalContext);
  const setModalActive = useContext(SetModalContext);
  const user = useContext(UserContext);
  const storage = useContext(StoreContext);
  const setUser = useContext(SetUserContext);
  let dbRef = {};
  const dbContext = useContext(DbContext);
  get(ref(dbContext, "users/")).then((val) => (dbRef = val.val()));


  return (
    <div className="homepageholder">
      {modalActive ? <ModalCreator /> : null}
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
          <div className="following">
            <div>{user.following.length}</div>
            <div>Following</div>
          </div>
          <div className="followers">
            <div>{user.followers.length}</div>
            <div>Followers</div>
          </div>
          <div className="posts">
            <div>{user.posts.length}</div>
            <div>Posts</div>
          </div>
          <div
            className="newpost"
            onClick={() => {
              setModalActive(true);
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
