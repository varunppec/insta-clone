import { useContext, useState } from "react";
import { DbContext, UserContext, StoreContext, SetUserContext } from "./Context";
import { DockSharp, EditRounded as EditOutlined } from "@material-ui/icons";
import { useRef } from "react";
import {
  listAll,
  ref as sref,
  getDownloadURL,
  deleteObject,
  uploadBytes,
} from "firebase/storage";
import { ref, set, get } from "firebase/database";
import uniqid from "uniqid";
import { useNavigate } from "react-router-dom";

const ProfileSettings = () => {
  const navigate = useNavigate();
  const setUser = useContext(SetUserContext)
  const user = useContext(UserContext);
  const storage = useContext(StoreContext);
  const db = useContext(DbContext);
  const [ppVar, setPpVar] = useState({});
  const [photoVar, setPhotoVar] = useState({});
  const saveProfile = async () => {
    const photoReader = new FileReader();
    const ppReader = new FileReader();

    const pp = document.querySelector("#pp");
    const ppFiles = pp.files[0] || user.pp;
    const photo = document.querySelector("#photo");
    const photoFiles = photo.files[0] || user.photo;
    // if (photo.name) {

    //   photoReader.readAsDataURL(photo);
    //   photoReader.onload = async function () {
    //     setPhotoVar(this.result);
    //   };
    // }
    // if (pp.name) {
    //   ppReader.readAsDataURL(pp);
    //   ppReader.onload = async function () {
    //     setPpVar(this.result);
    //   };
    // }

    const name = document.querySelector("#name").value;
    const bio = document.querySelector("#bio").value;
    let data = await (await get(ref(db, `users/${user.uid}`))).val();
    if (
      name === user.name &&
      bio === user.bio &&
      user.pp === ppFiles &&
      user.photo === photoFiles
    ) {
      return;
    }
    if (user.name !== name || user.bio !== bio) {
      data.bio = bio;
      data.name = name;
      set(ref(db, `users/${user.uid}`), data);
    }
    if (user.photo !== photoFiles) {
      const oldImageRef = await sref(storage, `${user.uid}/photo`);
      let random1 = await (await listAll(oldImageRef)).items;
      random1.forEach((x) => deleteObject(x));
      const newImageRef = await sref(storage, `${user.uid}/photo/${uniqid()}`);
      await uploadBytes(newImageRef, photoFiles);
      const newUrl = await getDownloadURL(newImageRef);
      data.photo = newUrl;
      set(ref(db, `users/${user.uid}/`), data);
    }
    if (user.pp !== ppFiles) {
      const oldImageRef = await sref(storage, `${user.uid}/pp`);
      let random1 = await (await listAll(oldImageRef)).items;
      random1.forEach((x) => deleteObject(x));
      const newImageRef = await sref(storage, `${user.uid}/pp/${uniqid()}`);
      await uploadBytes(newImageRef, ppFiles);
      const newUrl = await getDownloadURL(newImageRef);
      data.pp = newUrl;
      set(ref(db, `users/${user.uid}/`), data);
    }
    setUser(data);
    navigate("/");
  };

  const ppSubmit = (files) => {
    const pp = files[0];
    if (!pp.type.startsWith("image/")) {
      return;
    }
    const dispp = document.querySelector("#dispp");
    dispp.remove();
    const image = document.createElement("img");
    image.file = pp;
    image.id = "dispp";
    image.file = pp;
    document
      .querySelector("#pp")
      .parentNode.insertBefore(image, document.querySelector("#pp"));
    const reader = new FileReader();
    reader.onload = (function (aImg) {
      return function (e) {
        aImg.src = e.target.result;
      };
    })(image);
    reader.readAsDataURL(pp);
  };
  const photoSubmit = (files) => {
    const photo = files[0];
    if (!photo.type.startsWith("image/")) {
      return;
    }
    const dispp = document.querySelector("#disphoto");
    dispp.remove();
    const image = document.createElement("img");
    image.file = photo;
    image.id = "disphoto";
    image.file = photo;
    document
      .querySelector("#photo")
      .parentNode.insertBefore(image, document.querySelector("#photo"));
    const reader = new FileReader();
    reader.onload = (function (aImg) {
      return function (e) {
        aImg.src = e.target.result;
      };
    })(image);
    reader.readAsDataURL(photo);
  };
  return (
    <div className="psettingsholder">
      <div className="psettings">
        <div className="psettingheader">Edit Profile</div>
        <div className="ppholder">
          <div className="overlay">
            <EditOutlined />
          </div>
          <img id="dispp" src={user.pp} alt=""></img>
          <input
            id="pp"
            type="file"
            onInput={(e) => ppSubmit(e.target.files)}
          ></input>
        </div>
        <div className="photoholder">
          <div className="overlay">
            <EditOutlined />
          </div>
          <img id="disphoto" src={user.photo} alt=""></img>
          <input
            id="photo"
            type="file"
            onInput={(e) => photoSubmit(e.target.files)}
          ></input>
        </div>
        <div className="disname">
          <label htmlFor="name">Display Name:</label>
          <input
            id="name"
            maxLength="48"
            defaultValue={user.name}
            autoCorrect="false"
          ></input>
        </div>
        <div className="disbio">
          <label htmlFor="bio">Bio:</label>
          <textarea
            id="bio"
            rows="4"
            maxLength="120"
            defaultValue={user.bio}
            spellCheck="false"
          ></textarea>
        </div>
        <div className="savebutt">
          <button onClick={saveProfile}>Save</button>
        </div>
        <div className="viewprof">
          <button onClick={() => navigate("/")}>View Profile</button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
