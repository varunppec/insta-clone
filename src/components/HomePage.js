import { get, ref, once, set } from "firebase/database";
import { useContext } from "react";
import uniqid from "uniqid";
import {
  DbContext,
  UserContext,
  StoreContext,
  SetUserContext,
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
const HomePage = () => {
  const [modalActive, setModalActive] = useState(false);
  const user = useContext(UserContext);
  const storage = useContext(StoreContext);
  const setUser = useContext(SetUserContext);
  let dbRef = {};
  const dbContext = useContext(DbContext);
  get(ref(dbContext, "users/")).then((val) => (dbRef = val.val()));

  const uploadFile = async () => {
    const img = document.querySelector("#file");
    const caption = document.querySelector("#caption").value;
    const file = img.files[0];
    const imageRef = sref(
      storage,
      `${localStorage.getItem("userid")}/${uniqid()}`
    );
    await uploadBytes(imageRef, file);
    let userid = localStorage.getItem("userid");
    let val = await getDownloadURL(imageRef);

    let data = await get(ref(dbContext, `users/${userid}`));
    data = await data.val();
    let oldPosts = data["posts"] == "" ? false : true;
    if (oldPosts)
      data["posts"] = [
        ...data["posts"],
        { url: val, caption, time: new Date().getTime() },
      ];
    else data["posts"] = [{ url: val, caption, time: new Date().getTime() }];
    await set(ref(dbContext, `users/${userid}`), data);
    setUser(data);
    setModalActive(false);

  };

  function handleFile(files) {
    const file = files[0];
    if (!file.type.startsWith("image/")) {
      return;
    }
    const image = document.querySelector(".obj");
    if (image) {
      image.remove();
    }
    const preview = document.querySelector("#fileinputholder");
    const img = document.createElement("img");
    img.classList.add("obj");
    img.file = file;
    preview.appendChild(img); // Assuming that "preview" is the div output where the content will be displayed.

    const reader = new FileReader();
    reader.onload = (function (aImg) {
      return function (e) {
        aImg.src = e.target.result;
      };
    })(img);
    reader.readAsDataURL(file);
  }
  const dragAndDrop = () => {
    function dragenter(e) {
      e.stopPropagation();
      e.preventDefault();
    }

    function dragover(e) {
      e.stopPropagation();
      e.preventDefault();
    }
    function drop(e) {
      e.stopPropagation();
      e.preventDefault();

      const dt = e.dataTransfer;
      const files = dt.files;

      handleFile(files);
    }

    const dropbox = document.querySelector("#fileinputholder");
    dropbox.addEventListener("dragenter", dragenter, false);
    dropbox.addEventListener("dragover", dragover, false);
    dropbox.addEventListener("drop", drop, false);
  };
  // dragAndDrop();

  const modalCreator = () => {
    return (
      <div className="modal">
        <div className="fileuploadholder">
          <div>
            <div className="fileuploadheader">
              <div>Create New Post</div>
              <CloseOutlined
                onClick={() => {
                  setModalActive(false);
                }}
              />
            </div>
            <div className="fileupload">
              <div id="fileinputholder">
                <input
                  id="file"
                  type="file"
                  onInput={(e) => {
                    handleFile(e.target.files);
                  }}
                ></input>
                <CloudUpload></CloudUpload>
                File size limit is 5MB
              </div>
              <div className="caption">
                <textarea
                  rows="4"
                  cols="20"
                  placeholder="Enter Caption..."
                  id="caption"
                ></textarea>
              </div>
              <button id="postbutton" onClick={() => uploadFile()}>
                Post
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  return (
    <div className="homepageholder">
      {modalActive ? modalCreator() : null}
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
            <div>{user.followers.length ? user.followers.length : 0}</div>
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
