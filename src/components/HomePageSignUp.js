import {
  FacebookAuthProvider,
  getAuth,
  getRedirectResult,
  signInWithPopup,
  signInWithRedirect,
} from "firebase/auth";
import { forwardRef, useContext, useState } from "react";
import { SignedInContext } from "./Context";

const HomePageSignUp = () => {
  const value = useContext(SignedInContext);
  console.log(value);
  const signIn = async () => {
    const provider = new FacebookAuthProvider();
    const auth = getAuth();
    await signInWithRedirect(auth, provider);
  };

  const checkID = () => {
    const input = document.querySelector("#userid");
    const errormessage = document.querySelector(".errormessage");
    const button = document.querySelector("#signupbut");
    // button.onfocus = () => {
    //   console.log("haha");
    // };
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
    } else {
      errormessage.innerText = "ID is available";
      errormessage.style.color = "rgba(0,180,0,1)";
      button.classList.remove("disabled");
      button.disabled = false;
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
              disabled={true}
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
              <div>Log in with Facebook</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePageSignUp;
