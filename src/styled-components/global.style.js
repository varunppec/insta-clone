import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
@import url('https://fonts.googleapis.com/css2?family=Cookie&display=swap');
div {
    cursor: default;
}
html, body {
    margin: 0;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}
.App {
    background-color: ${({theme})=>theme.mainBgColor}
}

nav {
    display: flex;
    justify-content: space-around;
    width: 100%;
    min-height: 55px;
    align-items: center;
    box-shadow: 0 1px 5px 2px ${({theme}) => theme.boxShadowColor};
    background-color: ${({theme}) => theme.bgColor};
    position: sticky;
    top: 0;
    margin-bottom: 15px;
    z-index: 7;
}

.navhead, .signuphead {
    font-family: 'Cookie', cursive;
    font-size: 2.7rem;
    color: ${({theme}) => theme.textColor};
}

.navinput > input{
    min-height: 33px;
    min-width: 200px;
    width: 50%;
    padding: 0 10px;
    background-color: ${({theme}) => theme.inputBgColor}; //here
    border: 1px solid ${({theme}) => theme.inputBorderColor};//here
    color: ${({theme}) => theme.textColor};
    border-radius: 5px;
    outline: none;
}

.navicons {
    display: flex;
    align-items: center;
    gap: 15px;
}

.navicons > div {
    position: relative;
    z-index: 1;
}

.navicons > svg, .navicons > div > svg {
    font-size: 1.8rem;
    fill: none;
    stroke-width: 1.4px;
    stroke: ${({theme}) => theme.textColor};
    z-index: 1;
}
.navicons > svg:nth-child(2) {
    font-size: 1.6rem;
}
.navicons > svg:hover, .navicons > div > svg:hover, .navicons > .iconactive, .navicons > div > .iconactive {
    fill:${({theme}) => theme.textColor};
}
.homepagepost {
    width: 100%;
    height: 700px;
    box-shadow: 0 0 20px 1px ${({theme}) => theme.boxShadowColor};
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    position: relative;
    background-color: ${({theme}) => theme.postBgColor};
    color: ${({theme}) => theme.textColor};
}
.userstats > div:hover {
    font-weight: bold;
    transform: translateY(5%);
}

.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: 'rgba(0, 0, 0, 0.8)';
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10;
}


.homepagepost > div:first-child {
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 8px 15px;
}
.homepagepost > div:first-child > img {
    border-radius: 50%;
}
.homepagepost > div:first-child > svg {
    margin-left: auto;
}
.hppagepostuploadinfo {
    font-weight: bold;
}
.hppagepostuploadinfo > div:last-child {
    font-weight: normal;
    font-size: 0.9rem;
    color: ${({theme}) => theme.textColor};
}

.homepagepost > img {
    width: 100%;
    height: 70%;
}
.homepagepost  > .postbuttons {
    margin: 5px 10px 0px 10px;
}

.homepagepost > .postextrainfo {
    margin: 0px 10px;
}

.homepagepost > .addcomment {
    margin: 5px 10px;
}

.somecomments {
    display: flex;
    flex-direction: column;
    margin: 0px 10px;
    gap: 2px;
}

.somecomments > div {
    display: flex;
    gap: 5px;
    font-weight: bold;
    font-size: 0.9rem;
}

.somecomments > div > div:last-child {
    font-weight: normal;
}

.homepagepost > .postextrainfo > div {
    font-size: 0.9rem;
    font-weight: bold;
    color: ${({theme}) => theme.textColor};
}

.posttimeupload {
    margin: 5px 10px;
    font-size: 0.8rem;
    color: ${({theme}) => theme.secTextColor};
}

.hppostcaption {
    margin: 0px 10px;
    display: flex;
    gap: 5px;
    font-size: 0.9rem;
}


.postextrainfo > div:first-child {
    font-size: 0.9rem;
}
.postextrainfo > div:last-child {
    font-size: 0.8rem;
    color: ${({theme}) => theme.secTextColor};
    margin-top: 5px;
}

.addcomment {
    margin-top: 5px;
    border-top: ${({theme}) => theme.borderColor};
    display: flex;
    align-items: center;
}

.addcomment > textarea {
    color: ${({theme}) => theme.textColor};
    display: flex;
    flex-grow: 1;
    border: none;
    background-color: transparent;
    resize: none;
    outline: none;
    border: none;
    max-width: 95%;
    width: 95%;
    height: 18px !important;
    max-height: 80px;
    font-size: 0.9rem;
    overflow-wrap: break-word;
    overflow-y: visible;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

.addcomment > button {
    font-weight: bold;
    background-color: transparent;
    border: none;
    margin-left: auto;
    font-size: 0.9rem;
    color:${({theme}) => theme.blueButtonColor};
}

#post:hover {
    background-color: transparent;
}

.postcomments {
    color: ${({theme}) => theme.textColor};
}

.postcomments > div {
    display: flex;
    width: 100%;
    /* height: 35px; */
    align-items: flex-start;
    gap: 5px;
}

.postcomments > div > img {
    min-height: 30px;
    min-width: 30px;
    max-width: 30px;
    max-height: 30px;
    border-radius: 50%;
}
.postcomments > div > div:first-of-type {
    font-size: 0.9rem;
    gap: 5px;
    color: ${({theme}) => theme.textColor};
    height: 100%;
    overflow-wrap: break-word;
    overflow-y: auto;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif
} 

.postcomments > div > div:last-child {
    font-weight: lighter;
    margin-left: auto;
    font-size: 0.8rem;
    color: ${({theme}) => theme.secTextColor};
    align-self: center;
}
.postcomments > div > div > div {
    display: inline;
    margin-right: 5px;
    font-weight: bold;
    color: ${({theme}) => theme.textColor};
    font-size: 1rem;
}
.postbuttons {
    color: ${({theme}) => theme.textColor};
}
.postbuttons > .favclicked {
    fill: rgba(255, 0, 0, 0.8);
}

.homepagegrid {
    display: flex;
    flex-direction: column;
    width: 40%;
    align-items: center;
    gap: 70px;
}


.hppostcaption > div:first-child {
    font-weight: bold;
}

.viewcomments {
    margin: 5px 10px;
    color: ${({theme}) => theme.secTextColor};
    font-size: 0.9rem;
}
.sharetooltip {
    margin-left: auto;
    position: relative;
    display: inline-block;
    border-bottom: 1px solid dotted black;
}
.sharetooltiptext {
    visibility: hidden;
    position: absolute;
    width: 120px;
    background-color: ${({theme}) => theme.bgColor};
    color: ${({theme}) => theme.textColor};
    text-align: center;
    padding: 5px 0;
    border-radius: 6px;
    z-index: 1;
    opacity: 0;
    transition: opacity 0.3s;
    top: 100%;
    left: -200%;
    box-shadow: 0px 0px 2px 1px ${({theme}) => theme.boxShadowColor};
}
.sharetooltip > svg:hover {
    opacity: 70%;
}
.followholder {
    background-color: ${({theme}) => theme.bgColor};
    width: 50%;
    height: 80%;
    border-radius: 8px;
}
.followholder > div {
    margin: 20px 20px;
    height: calc(100% - 40px);
}
.followheader {
    display: flex;
    align-items: center;
    gap: 25px;
    color: ${({theme}) => theme.secTextColor};
    padding-bottom: 15px;
    border-bottom: 2px solid ${({theme}) => theme.borderColor};
    font-size: 1.2rem;
    font-weight: bold;
}

.followheader > *:hover {
    color: ${({theme}) => theme.textColor};
}

.followheader > *:last-child {
    margin-left: auto;
}

.active {
    color: ${({theme}) => theme.textColor};
}

.followingitems {
    margin-top: 15px;
    display: flex;
    align-items: center;
    height: 60px;
    gap: 20px;
    color: ${({theme}) => theme.textColor};
    border-radius: 10px;
    padding: 5px 0px;
}

.followingitems: hover {
    background-color: ${({theme}) => theme.inputBgColor};
}
.followingitems > img {
    min-width: 60px;
    height: 100%;
    border-radius: 50%;
    margin-left: 5px;
}

.followingitems > div {
    display: flex;
    flex-direction: column;
    max-width: 250px;
    min-width: 100px;
    gap: 2px;
}
.followingitems > div > div:first-child {
    font-size: 1.4rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.followingitems > div > div:last-child {
    color: ${({theme}) => theme.secTextColor};
}


.followingitems > button {
    margin-left: auto;
    margin-right: 5px;
    height: 45px;
    min-width: 120px;
    border-radius: 50px;
    border: 1px solid ${({theme}) => theme.secTextColor};
    color: ${({theme}) => theme.secTextColor};
    font-weight: bold;
    font-size: 1rem;
    background-color: ${({theme}) => theme.bgColor};
}

.followingitems > button:hover {
    background-color: ${({theme}) => theme.oppColor};
    color: ${({theme}) => theme.viewProfColor};
}

.nofollowing {
    color: ${({theme}) => theme.secTextColor};
    font-weight: bold;
    font-size: 1.1rem;
    margin-top: 20px;
}


.sharetooltiptext::after {
    content: "";
    position: absolute;
    top: -20%;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: transparent transparent ${({theme}) => theme.secTextColor}; 
}

.menuitems {
    position: absolute;
    width: 100%;
    background-color: ${({theme}) => theme.mainBgColor};
    color: ${({theme}) => theme.textColor};
    border-radius: 5px;
    z-index: 1;
    opacity: 1;
    transition: opacity 0.3s;
    top: 0%;
    left: 0%;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    gap: 5px;
    /* padding: 10px 10px; */
    box-shadow: 0px 0px 3px ${({theme}) => theme.secTextColor};
}

.menubox {
    position: absolute;
    width: 350px;
    top: 130%;
    left: -75px;
    display: flex;
    justify-content: center;
}
.navarrow {
    background-color: ${({theme}) => theme.mainBgColor};
    left: 175px;
    top: -5%;
    position: absolute;
    height: 20px;
    width: 20px;
    transform: rotate(45deg);
    box-shadow: 0 0 3px ${({theme}) => theme.secTextColor};
}


.menuitems > div {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 0.9rem;
    gap: 5px;
    min-height: 40px;
    border-radius: 5px;
    margin: 10px 10px;
    padding: 0px 10px;
    width: calc(100% - 40px);
}
.menuitems > div:hover {
    background-color: ${({theme}) => theme.borderColor};
}

.menuitems > div > div > img {
    border-radius: 50%;
    height: 33px;
    width: 33px;
}

.menuitems > div > div {
    display: flex;
    align-items: center;
    gap: 5px;
    font-weight: bold;
}
.menuitems > div > div:first-child {
    width: 66%;
}

.menuitems > div > div:last-child {
    color: ${({theme}) => theme.secTextColor};
    font-weight: normal;
}

.popup {
    position: absolute;
    width: 250px;
    background-color: ${({theme}) => theme.bgColor};
    color: ${({theme}) => theme.textColor};
    text-align: center;
    border-radius: 6px;
    transition: opacity 0.3s;
    top: 150%;
    left: 0;
    transform: translateX(-50%);
    box-shadow: 0px 3px 8px 1px ${({theme}) => theme.boxShadowColor};
    display: flex;
    flex-direction: column;
}
.viewprofile {
    visibility: hidden;
    opacity: 0;
    background-color: ${({theme}) => theme.viewProfColor};
    border-radius: 10px;
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
}

.viewprofile > div {
    position: absolute;
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
}
.viewprofile > div > button {
    border: 1px solid ${({theme}) => theme.borderColor};
    border-radius: 100px;
    font-weight: bold;
    font-size: 1rem;
    min-height: 50px;
    min-width: 150px;
    background-color: ${({theme}) => theme.blackButtonColor};
    box-shadow: 0 0 20px 1px ${({theme}) => theme.boxShadowColor};
    color: ${({theme}) => theme.textColor};
    align-self: center;
}

.viewprofile > div > button:hover {
    background-color: ${({theme}) => theme.secTextColor};
    color: ${({theme}) => theme.mainBgColor};
}

.viewprofile > svg {
    z-index: 5;
    margin-left: auto;
    margin-right: 10px;
    margin-top: 10px;
    font-size: 2rem;
    color: ${({theme}) => theme.secTextColor};
}
.viewprofile > svg:hover {
    color: ${({theme}) => theme.textColor};
}
.popup::after {
    content: "";
    width: 15px;
    height: 15px;
    position: absolute;
    transform: translateX(50%) translateY(-50%) rotate(-45deg);
    background-color: ${({theme}) => theme.bgColor};
    top: 0%;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    box-shadow: 2px -2px 5px 0px ${({theme}) => theme.boxShadowColor};
    z-index: -1;
}

.popup > div {
    font-size: 0.9rem;
    padding: 10px 10px;
    text-align: left;
    display: flex;
    justify-content: space-between;
}

.popup > div:hover {
    background-color: ${({theme}) => theme.borderColor};
}
.popup > div > div > span {
    font-weight: bold;
}
.popup > div > div:last-child {
    color: ${({theme}) => theme.secTextColor};
    font-size: 0.7rem;
    align-self: flex-end;
}
.popup > div >span::after {
    content: " ";
}

.heartclick > svg {
    font-size: 1.7rem;
}
.personclick > .popup {
    width: 150px;
}

.personclick > .popup > div {
    justify-content: flex-start;
    gap: 10px;
}
.personclick > .popup > div > div:last-child {
    color: ${({theme}) => theme.textColor};
    font-size: 0.9rem;
    align-self: center;
}
.messageheader {
    min-height: 80px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 30px;
    color: ${({theme}) => theme.textColor};
    border-bottom: 1px solid ${({theme}) => theme.borderColor};
    background-color: ${({theme}) => theme.mainBgColor};
}

.messageheader > div {
    font-size: 1.4rem;
    font-weight: bold;
}

.messageheader > svg {
    color: ${({theme}) => theme.secTextColor};
    font-size: 1.3rem;
}

.messageheader > svg:hover {
    color: ${({theme}) => theme.textColor};
}

.conversationlist {
    display: flex;
    flex-direction: column;
}

.conversationlist > div {
    margin: 5px 10px;
    border-radius: 30px;
    box-shadow: 0px 0px 4px ${({theme}) => theme.boxShadowColor};
    display: flex;
    gap: 10px;
    background-color: ${({theme}) => theme.mainBgColor};
    color: ${({theme}) => theme.textColor};
}
.conversationlist > div > img {
    height: 60px;
    width: 60px;
    border-radius: 50%;
    margin-left: 5px;
    margin: 10px;
}

.conversationlist > div > div {
    display: flex;
    flex-direction: column;
    justify-content: center;
    font-size: 0.9rem;
    margin-right: 10px;
}

.conversationlist > div > div > div:first-child {
    font-weight: bold;
    font-size: 1rem;
}

.messageprofiles {
    border: 1px solid ${({theme}) => theme.borderColor};
    background-color: ${({theme}) => theme.msgProfileBgColor};
}

.conversationholder {
    border-top: 1px solid ${({theme}) => theme.convoHolderBgColor};
    display: flex;
    flex-direction: column-reverse;
    padding: 10px 20px;
    gap: 10px;
    overflow-y: scroll;
}

.conversationmessage {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
}

.conversationmessage > textarea {
    background-color: ${({theme}) => theme.postBgColor};
    color: ${({theme}) => theme.textColor};
    resize: none;
    outline: none;
    border-radius: 50px;
    border: 1px solid ${({theme}) => theme.borderColor};
    height: 30px;
    max-height: 30px;
    width: 70%;
    padding: 0px 15px;
    padding-top: 6px;
    scroll-padding: 6px 0px;
    overflow-y: scroll;
    font-size: 1rem;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

.conversationmessage > div {
    color: ${({theme}) => theme.blueButtonColor};
    font-weight: bold;
}

.fromtomessageholder {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 10px 20px;
}
.frommessageholder {
    display: flex;
    justify-content: flex-end;
}
.frommessage {
    max-width: 80%;
    display: flex;
    flex-direction: row-reverse;
    gap: 10px;
}

.frommessage > img {
    border-radius: 50%;
}

.frommessage >  {
    background-color: ${({theme}) => theme.blueButtonColor};
    color: ${({theme}) => theme.bgColor};
    border-radius: 50px;
    padding: 15px 15px;
}

.tomessageholder {
    display: flex;
    justify-content: flex-start;
}

.tomessage {
    max-width: 80%;
    display: flex;
    flex-direction: row;
    gap: 10px;
}

.tomessage > img {
    border-radius: 50%;
}

.tomessage > div {
    background-color: ${({theme}) => theme.toMsgBgColor};
    color:  ${({theme}) => theme.textColor};
    border-radius: 50px;
    padding: 15px 15px;
}

.messagemodal {
    width: 60%;
    height: 80%;
    background-color: ${({theme}) => theme.postBgColor};
    color: ${({theme}) => theme.textColor};
    border-radius: 15px;
}

.messagemodalheader {
    margin: 20px 15px;
    font-size: 1.5rem;
    font-weight: bold;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid ${({theme}) => theme.borderColor};
    padding-bottom: 10px;
}
.messagemodalheader > svg {
    color: ${({theme}) => theme.secTextColor};
}
.messagemodalheader > svg:hover {
    color: ${({theme}) => theme.textColor};
}
.messagemodalitemsholder {
    margin: 5px 15px;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.messagemodalitem {
    display: flex;
    align-items: center;
    gap: 15px;
    border-radius: 10px;
}

.messagemodalitem:hover {
    background-color: ${({theme}) => theme.borderColor};   
}
.messagemodalitem > img {
    height: 60px;
    width: 60px;
    border-radius: 50%;
    margin: 10px 15px;
}
.messagemodalitem > div {
    display: flex;
    flex-direction: column;
    gap: 1px;
}
.messagemodalitem > div > div:first-child {
    font-size: 1.2rem;
    font-weight: bold;
}

.messagemodalitem > div > div:last-child {
    font-size: 0.9rem;
    color: ${({theme}) => theme.secTextColor};
    font-weight: bold;
}

#msginput {
    font-weight: bold;
    background-color: transparent;
    border: none;
    font-size: 0.9rem;
    color: ${({theme}) => theme.blueButtonColor};
}


.signupinputs > * {
    margin: 2px;
}

.errormessage {
    color: rgba(0, 0, 0, 0.4); //here
    font-size: 0.7rem;
}

.supinputs {
    display: flex;
    border: 1px solid rgba(0, 0, 0, 0.308); //here
    border-radius: 50px;
    width: fit-content;
    padding: 5px 0;
    align-items: center;
}

.supinputs > div {
    border-right: 1px solid rgba(0, 0, 0, 0.308); //here
    color: rgba(0, 0, 0, 0.308); //here
    padding: 0 5px;
}
.supinputs > input {
    outline: none;
    border: none;
    margin: 0 5px;
    border-radius: 10px;
    background-color: ${({theme}) => theme.postBgColor};
    color: ${({theme}) => theme.textColor};
    padding: 5px 10px;
}


.signupor {
    display: flex;
    align-items: center;
}
.signupor>div:first-child, .signupor>div:last-child {
    height: 2px;
    background-color: ${({theme}) => theme.borderColor};
    flex:1;
}
.signupor>div:nth-child(2) {
    margin: 0 20px;
    color: ${({theme}) => theme.borderColor};
    font-weight: bold;
    font-size: 0.95rem;
}

.signupform>div>button {
    background-color: ${({theme}) => theme.blueButtonColor};
    color: white;
    min-width: 250px;
    border: none;
    border-radius: 5px;
    min-height: 30px;
    font-size: 1.1rem;
    font-weight: bold;
    margin: 10px 0;
}

.homepagesignup {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
}
.signupformholder {
    display: flex;
    align-items: center;
    justify-content: center;
}
.signupform {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    width: fit-content;
    padding: 30px 50px;
    box-shadow: 0 1px 5px ${({theme}) => theme.boxShadowColor};
    color:${({theme}) => theme.secTextColor};
    border-radius: 10px;
}

.logindiv {
    margin-top: 5px;
}

.logindiv > div:first-child {
    font-size: 0.8rem;
    margin-bottom: 3px;
}

.login {
    font-size: 1rem;
}

.login > div {
    text-decoration: none;
    color: ${({theme}) => theme.blueButtonColor};
}

.login > div:hover {
    text-decoration: underline;
}

.disabled {
    opacity: 50%;
}

.homepageholder {
    display: flex;
    gap: 50px;
    justify-content: center;
}

.homepageholder > div:last-child {
    width: 250px;
    color: ${({theme})=>theme.textColor}
}

.userinfoholder {
    display: flex;
    margin-top: 80px;
}

.userinfoholder > div > img {
    border-radius: 50%;
    height: 70px;
    width: 70px;
}

.userinfoholder > div:first-child {
    margin-right: 10px;
}
.userinfo {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 2px;
}
.userinfo > div:first-child {
    font-size: 1.6rem;
}
.userinfo > div:last-child {
    color: ${({theme}) => theme.secTextColor};
}


.userstats {
    margin-top: 5px;
    display: flex;
    gap: 13px;
}

.userstats > div > div:last-child {
    font-size: 0.8rem;
    color: ${({theme}) => theme.secTextColor};
    margin-top: 3px;
}

.userstats > div {
    display: flex;
    flex-direction: column;
    align-items: center;
    transition: transform .1s ease-in;
}

.newpost > svg {
    font-size: 1.2rem;
}

.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: ${({theme}) => theme.modalBgColor};
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10;
}

.fileuploadholder {
    background-color: ${({theme}) => theme.bgColor};
    width: 50%;
    height: 80%;
    border-radius: 8px;
}

.fileuploadholder > div {
    margin: 20px 20px;
    height: calc(100% - 40px);
}

.fileuploadheader {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: ${({theme}) => theme.secTextColor};
    padding-bottom: 15px;
    border-bottom: 2px solid ${({theme}) => theme.borderColor};
}

.fileuploadheader > div:first-child {
    font-size: 1.3rem;
}

.fileupload {
    min-height: calc(100% - 40px - 1.3rem - 15px);
    margin-top: 30px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
}

.fileupload > div {
    border-radius: 5px;
}

.fileupload > div:first-child {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border: 1px solid ${({theme}) => theme.borderColor};
    position: relative;
    font-size: .8rem;
    color: ${({theme}) => theme.secTextColor};
}

.fileupload > div > svg {
    position: relative;
    font-size: 10rem;
    fill: ${({theme}) => theme.textColor};
}

.fileupload > div > input {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 1;
    opacity: 0%;
}
.fileupload > div:first-child:hover {
    border: 1px solid ${({theme}) => theme.hoverColor};
    background-color: ${({theme}) => theme.hoverBgColor};
} 

.fileupload > div > textarea {
    resize: none;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    padding: 10px;
    scrollbar-width: none;
    border: 1px solid ${({theme}) => theme.borderColor};
    background-color: ${({theme}) => theme.bgColor};
    border-radius: 5px;
    color: ${({theme}) => theme.textColor};
}

.fileupload > div > textarea:focus, .fileupload > div > textarea:hover {
    border: none;
    outline: 1px solid ${({theme}) => theme.borderColor};
}

#fileinputholder {
    min-width: 300px;
    min-height: calc(3 / 4 * 300px);
}
#fileinputholder > img {
    position: absolute;
    height: 100%;
    width: 100%;
}
#postbutton {
    min-width: 100px;
    min-height: 35px;
    border: none;
    border-radius: 50px;
    color: ${({theme}) => theme.textColor};
    background-color: ${({theme}) => theme.bgColor};
    font-weight: bold;
}

.obj {
    background-color: ${({theme}) => theme.bgColor};;
}

.profileppholder > img {
    width: 100%;
    max-height: 220px;
}
.profilebuttons {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0 50px;
    transform: translateY(-50%);
}



.profilephoto {
   
}
.profilephoto > img {
    width: 200px;
    height: 200px;
    border-radius: 50%;
}

.profbuttons {
    display: flex;
    gap: 20px;
    align-items: center;
    
}

.profbuttons > button:first-child {
    border: none;
    border-radius: 100px;
    font-weight: bold;
    font-size: 1rem;
    min-height: 50px;
    min-width: 150px;
    background-color: ${({theme}) => theme.postBgColor};
    box-shadow: 0 0 20px 1px ${({theme}) => theme.boxShadowColor};
    color: ${({theme}) => theme.textColor};
}

.profbuttons > button:last-child {
    border: none;
    font-size: 1rem;
    border-radius: 50%;
    min-width: 50px;
    min-height: 50px;
    background-color: ${({theme}) => theme.postBgColor};
    box-shadow: 0 0 20px 1px ${({theme}) => theme.boxShadowColor};
    color: ${({theme}) => theme.textColor};
}

.profbuttons > button:hover {
    background-color: ${({theme}) => theme.oppColor};
    color: ${({theme}) => theme.mainBgColor};
}

.profiledetails {
    display: grid;
    grid-template-columns: 1fr 4fr;
    margin-top: 0;
    transform: translateY(-100px);
}

.sideprofile {
    margin-left: 50px;
}
.basedetails {
    color: ${({theme}) => theme.textColor};
    border-bottom: 1px solid ${({theme}) => theme.borderColor};
}
.basedetails > div:first-child{
    font-size: 2rem;
}
.basedetails > div:nth-child(2) {
    color: ${({theme}) => theme.secTextColor};
    font-size: 1.4rem;
}


.basedetails > div:last-child {
    display: flex;
    align-items: center;
    font-size: 1.2rem;
    gap: 5px;
}

.basedetails > div:last-child > h3 {
    font-size: 1.2rem;
}
.basedetails > div:last-child > p {
    color: ${({theme}) => theme.secTextColor};
}
.followinfo {
    margin-top: 15px;
    display: flex;
    gap: 40px;
    border-bottom: 1px solid ${({theme}) => theme.borderColor};
    justify-content: flex-start;
    color: ${({theme}) => theme.textColor};
}

.followinfo > div {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 15px;
    color: ${({theme}) => theme.secTextColor};
}

.followinfo > div:hover{
    color: ${({theme}) => theme.textColor};
}

.followinfo > div > h3 {
    margin: 0;
    font-size: 1.2rem;
    color: ${({theme}) => theme.textColor};
}

.followinfo > div > div {
    color: inherit;
}
.bio {
    color: ${({theme}) => theme.textColor};
}
.bio > h3 {
    margin-bottom: 5px;
}

.postgrid {
    display: grid;
    /* max-width: 100%; */
    grid-template-columns: repeat(auto-fill, 290px);
    grid-auto-rows: 300px;
    justify-content: space-around;
    margin: 0 40px;
    gap: 30px;
}

.postgrid > div {
    position: relative;
    border-radius: 10px;
    box-shadow: 0px 0px 30px ${({theme}) => theme.boxShadowColor};
}

.postgrid > div > div {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    opacity: 0;
    border-radius: 10px;
}

.postgrid > div > div > div {
    display: flex;
    gap: 5px;
    align-items: center;
}
.postgrid > div > div > div > * {
    font-size: 2rem;
    fill: ${({theme}) => theme.textColor};
    color: ${({theme}) => theme.textColor};
}

.postgrid > div > div:hover {
    opacity: 100%;
    background-color: ${({theme}) => theme.viewProfColor};
}

.postgrid > div > img {
    width: 100%;
    height: 100%;
    border-radius: 10px;
}

.psettingsholder {
    width: 100vw;
    height: calc(100vh - 55px);
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 10px;
}

.psettings {
    min-width: 33%;
    display: flex;
    flex-direction: column;
    gap: 20px;
    align-items: center;
    box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
    height: 95%;
    border-radius: 10px;
    background-color: ${({theme}) => theme.postBgColor};
    color: ${({theme}) => theme.textColor};
}

.ppholder {
    position: relative;
    min-width: 100%;
}
.overlay {
    width: 100%;
    height: 100%;
    position: absolute;
    display: flex;
    justify-content: flex-end;
}
.overlay > .MuiSvgIcon-root {
    fill: ${({theme}) => theme.textColor};
    margin-right: 8px;
    margin-top: 8px;
    opacity: 0;
}
.ppholder:hover .overlay, .photoholder:hover .overlay {
    background-color: ${({theme}) => theme.viewProfColor};
}

.ppholder:hover .overlay > * , .photoholder:hover .overlay > *{
    opacity: 90%;
}



.ppholder > img{
    display: block;
    max-height: 140px;
    width: 100%
}

.ppholder > input {
    z-index: 1;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    color: transparent;
}

.photoholder {
    position: relative;
    border-radius: 50%;
    /* bottom: 0; */
    /* transform: translateY(-80%); */
    z-index: 2;
    box-shadow: 0px 0px 10px ${({theme}) => theme.boxShadowColor};
}
.photoholder, .disname, .disbio, .savebutt, .viewprof {
    transform: translateY(-70px);
}

.photoholder > * {
    border-radius: 50%;
}

.photoholder > .overlay {
    justify-content: center;
    align-items: center;
}

.photoholder > .overlay > * {
    z-index: 3;
    margin: 0;
}

.photoholder > img {
    display: block;
    border-radius: 50%;
    width: 100px;
    height: 100px;
}

.photoholder > input {
    z-index: 3;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    border-radius: 50%;
}

.disname, .disbio {
    display: flex;
    flex-direction: column;
    color: ${({theme}) => theme.secTextColor};
    font-size: 0.8rem;
    min-width: 80%;
    justify-content: center;
    /* align-items: center; */
    width: 80%;
}

.disname > label, .disbio > label {
    align-self: flex-start;
}

.disname > input {
    width: 90%;
    outline: none;
    border-radius: 50px;
    border: 1px solid ${({theme}) => theme.secTextColor};
    min-height: 28px;
    padding-left: 10px;
    background-color: ${({theme}) => theme.mainBgColor};
    color: ${({theme}) => theme.textColor};
}

.disbio > textarea {
    width: 90%;
    resize: none;
    outline: none;
    border-radius: 10px;
    background-color: ${({theme}) => theme.mainBgColor};
    color: ${({theme}) => theme.textColor};
    border: 1px solid ${({theme}) => theme.secTextColor};
    padding: 2px 10px;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

.savebutt > button {
    box-shadow: 0px 0px 10px ${({theme}) => theme.boxShadowColor};
    transition: trasnform 0.1s ease-in;
}
.savebut > button:hover {
    transform: translateY(10%);
}
.savebutt > button {
    margin-left: auto;
    margin-right: 5px;
    height: 30px;
    min-width: 100px;
    width: 120px;
    border-radius: 50px;
    color: white;
    font-weight: bold;
    font-size: 1rem;
    background-color: ${({theme}) => theme.blueButtonColor};
    
}

.viewprof > button {
    margin-left: auto;
    margin-right: 5px;
    height: 30px;
    min-width: 100px;
    width: 120px;
    border-radius: 50px;
    border: 1px solid ${({theme}) => theme.secTextColor};
    color: ${({theme}) => theme.secTextColor};
    font-weight: bold;
    font-size: 1rem;
    background-color: ${({theme}) => theme.bgColor};
}

.viewprof > button:hover {
    color: ${({theme}) => theme.mainBgColor};
    background-color: ${({theme}) => theme.oppColor};
}

.psettingheader {
    margin-top: 10px;
    font-size: 1.3rem;
    font-weight:bold;
}



.postuser > img, .imgholder > img {
    width: 70px;
    height: 70px;
    border-radius: 50%;
}

.imgholder > img {
    width: 100%;
    height: 100%;
    border-radius: 1px;
}

.postholder {
    width: 100vw;
    min-height: 80vh;
    display: flex;
    justify-content: center;
}

.post {
    width: 75%;
    display: grid;
    grid-template-columns: minmax(400px, 3fr) 2fr;
    gap: 10px
}

.postinfo {
    display: grid;
    grid-template-rows: 200px;
    grid-template-columns: 1fr;
    grid-auto-rows: 40px;
}

.postuploader {
    display: flex;
    justify-content: center;
    border-bottom: 1px solid ${({theme}) => theme.borderColor};
}

.postuserholder {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 5px;
    color: ${({theme}) => theme.textColor};
}

.postuser {
    display: flex;
    gap: 10px;
}

.postuserinfo {
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.postuserinfo > * {
    margin: 0;
    font-size: 1rem;
}

.postuserinfo > h1 {
    font-size: 1.2rem;
    display: flex;
    font-weight: bold;
}
.postuserinfo > p {
    color: ${({theme}) => theme.secTextColor};
}

.postcaption {
    display: flex;
    justify-content: center;
    margin-top: 5px;
    color: ${({theme}) => theme.secTextColor};
    font-size: 0.9rem;
    width: 200px;
    height: 60px;
    overflow-wrap: break-word;
    overflow-y: scroll;
}

.postcomments {
    margin-top: 10px;
    grid-row: span 7;
    display: flex;
    overflow-wrap: break-word;
    overflow-y: auto;
    scroll-behavior: smooth;
    scrollbar-width: none;
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.postbuttons {
    display: flex;
    gap: 10px;
    align-items: center;
}


.postbuttons > svg:last-child {
    margin-left: auto;
}

.postbuttons > svg:hover {
    opacity: 70%;
}

.nocomments {
    width: 100%;
    display: flex;
    flex-direction: column;
    margin-top: 10px;
    align-items: center;
}

.postextrainfo {
    color: ${({theme}) => theme.textColor};
}






.searchmenu {
    position: relative;
    display: inline-block;
}



.messagesholder {
    height: calc(100vh - 70px);
    display: grid;
    grid-template-columns: 1fr 3fr;
}

.frommessage > .msgtime, .tomessage > .msgtime {
    font-weight: bold;
    font-size: 0.7rem;
    background-color: transparent;
    padding: 0;
    border-radius: 0;
    color: ${({theme}) => theme.secTextColor};
    align-self: flex-end;
}
.rectangle, .circle {
    animation: skeleton-loading 1s linear infinite alternate;
}

@keyframes skeleton-loading {
    0% {
        background-color: ${({theme}) => theme.initColor};
    }
    100% {
        background-color: ${({theme}) => theme.finalColor};
    }
}
.circle {
    border-radius: 50%;
    background-color: grey;
}
.homepagepost > div > .circle {
    width: 35px;
    height: 35px;
}

.rectangle {
    background-color: grey;
    border-radius: 5px;
}


`