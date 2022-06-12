import {
  FacebookAuthProvider,
  getAuth,
  getRedirectResult,
  signInWithPopup,
  signInWithRedirect,
} from "firebase/auth";
import { get, set, ref } from "firebase/database";
import { forwardRef, useContext, useState } from "react";
import { DbContext, UserContext } from "./Context";
import React from "react";

const HomePageSignUp = ({ userID, setTest }) => {
  let dbRef = {};
  const dbContext = useContext(DbContext);
  get(ref(dbContext, "users/")).then((val) => (dbRef = val.val()));
  const signIn = async () => {
    const id = checkID(); //checks if id is in db returns id if found else
    if (!id) return;
    localStorage.setItem("userid", id);
    const provider = new FacebookAuthProvider();
    const auth = getAuth();
    await signInWithRedirect(auth, provider);
  };

  const logIn = async () => {
    const provider = new FacebookAuthProvider();
    const auth = getAuth();
    await signInWithRedirect(auth, provider);
  };

  const checkID = () => {
    const input = document.querySelector("#userid");
    const errormessage = document.querySelector(".errormessage");
    const button = document.querySelector("#signupbut");
    button.classList.add("disabled");
    button.setAttribute("disabled", true);
    errormessage.style.color = "rgba(0,0,0,0.4)";
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
    console.log(dbRef);
    if (dbRef[input.value]) {
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
      <div></div>
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
                Log in with Facebook
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
