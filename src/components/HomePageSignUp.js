import {
  FacebookAuthProvider,
  getAuth,
  getRedirectResult,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
} from "firebase/auth";
import { get, set, ref } from "firebase/database";
import { forwardRef, useContext, useState } from "react";
import { DbContext, SetUserContext, UserContext } from "./Context";
import React from "react";

const HomePageSignUp = ({ userID, setTest }) => {
  const dbContext = useContext(DbContext);
  const setUser = useContext(SetUserContext);
  const signIn = async () => {
    const id = await checkID(); //checks if id is in db returns id if found else
    if (!id) return;
    localStorage.setItem("userid", id);
    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    let result = await signInWithPopup(auth, provider);
    let data = await (await get(ref(dbContext, `users`))).val();
    let index;
    if (
      data && 
      Object.keys(data)
        .map((x) => {
          index = x;
          return data[x].email;
        })
        .includes(result.user.email)
    ) {
      localStorage.setItem("userid", index);
      setUser(data[index]);
    } else {
      let value = result.user;
      let val = {
        name: value.displayName,
        uid: id,
        usercode: value.uid,
        photo: value.photoURL,
        email: value.email,
        posts: "",
        pp: "https://firebasestorage.googleapis.com/v0/b/insta-clone-3ada4.appspot.com/o/default_pp.jpg?alt=media&token=52c9c68a-5365-4dcd-9d7b-cda5457c86cb",
        bio: `Hey there! My name is ${value.displayName}. Stop stalking :(`,
      };
      set(ref(dbContext, `users/${id}`), val);
      setUser(val);
    }
  };

  const logIn = async () => {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    let result = await signInWithPopup(auth, provider);
    let data = await (await get(ref(dbContext, `users`))).val();
    if (
      data &&
      Object.keys(data)
        .map((x) => {
          return data[x].email;
        })
        .includes(result.user.email)
    ) {
      let index = Object.keys(data)
        .map((x) => {
          return data[x].email;
        })
        .indexOf(result.user.email);
      index = Object.keys(data)[index];
      localStorage.setItem("userid", index);
      setUser(data[index]);
    }
  };

  const checkID = async () => {
    let dbData = await (await get(ref(dbContext, "users/"))).val();
    const input = document.querySelector("#userid");
    const errormessage = document.querySelector(".errormessage");
    const button = document.querySelector("#signupbut");
    button.classList.add("disabled");
    button.setAttribute("disabled", true);
    errormessage.style.color = "rgb(127,127,127)";
    if (input.value === "") {
      errormessage.innerText = "ID must be between 3 - 15 characters";
      return;
    }
    if (input.value.length < 3) {
      errormessage.innerText = "Too short";
      return;
    }
    if (input.value.length > 15) {
      errormessage.innerText = "Too long";
      return;
    }
    if (dbData && dbData[input.value]) {
      errormessage.innerText = "ID has already been taken";
      return;
    } else {
      errormessage.innerText = "ID is available";
      errormessage.style.color = "rgba(0,180,0,1)";
      button.classList.remove("disabled");
      button.disabled = false;
      return input.value;
    }
  };
  return (
    <div className="homepagesignup">
      <div className="signupformholder">
        <div className="signupform">
          <div className="signuphead">Instagram</div>
          <div className="signupinputs">
            <div className="supinputs">
              <div>@</div>
              <input
                autoComplete="off"
                id="userid"
                placeholder="Username"
                type="text"
                onInput={() => checkID()}
              />
            </div>
            <div className="errormessage">
              ID must be between 3 - 15 characters
            </div>
          </div>
          <div>
            <button
              id="signupbut"
              className="disabled"
              onClick={() => {
                signIn();
              }}
            >
              Sign Up
            </button>
          </div>
          <div className="signupor">
            <div></div>
            <div>OR</div>
            <div></div>
          </div>
          <div className="logindiv">
            <div>Already have an account?</div>
            <div className="login">
              <div
                onClick={() => {
                  logIn();
                }}
              >
                Log in with Google
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// const ForHomePageSignUp = React.forwardRef(HomePageSignUp);

export default HomePageSignUp;
