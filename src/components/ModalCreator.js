import uniqid from "uniqid";
import { ref as sref, uploadBytes, getDownloadURL } from "firebase/storage";
import { get, ref, set } from "firebase/database";
import {
  AddCircleOutline,
  CloudUploadOutlined as CloudUpload,
  CloseOutlined,
} from "@material-ui/icons";
import { useContext } from "react";
import {
  DbContext,
  ModalContext,
  SetModalContext,
  SetUserContext,
  StoreContext,
} from "./Context";

const ModalCreator = () => {
  const setUser = useContext(SetUserContext);
  const storage = useContext(StoreContext);
  const modalActive = useContext(ModalContext);
  const setModalActive = useContext(SetModalContext);
  const db = useContext(DbContext);
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

    let data = await get(ref(db, `users/${userid}`));
    data = await data.val();
    let oldPosts = data["posts"] === "" ? false : true;
    if (oldPosts)
      data["posts"] = [
        ...data["posts"],
        { url: val, caption, time: new Date().getTime() },
      ];
    else data["posts"] = [{ url: val, caption, time: new Date().getTime() }];
    await set(ref(db, `users/${userid}`), data);
    setUser(data);
    setModalActive(false);
  };

  const handleFile = (files) => {
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
  };

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

export default ModalCreator;
