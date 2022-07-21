import uniqid from "uniqid";
import { CloseOutlined, EditOutlined as Edit } from "@material-ui/icons";
import { get, ref, set } from "firebase/database";
import { useEffect } from "react";
import { useContext } from "react";
import { useState } from "react";
import {
  MessageModalContext,
  SetMessageModalContext,
  SetActiveConvoContext,
  ActiveConvoContext,
  DbContext,
  UserContext,
} from "./Context";
const Messages = () => {
  const db = useContext(DbContext);
  const user = useContext(UserContext);
  const [update, setUpdate] = useState(0);
  const [messageModal, setMessageModal] = useState(false);
  const [activeConvo, setActiveConvo] = useState({});
  const [convoList, setConvoList] = useState([]);

  const getConvoList = async () => {
    let data = await (await get(ref(db, `messages`))).val();
    console.log(data);
    let list = data
      ? data.filter((x) => {
          for (let y of x.members) {
            console.log(y.uid, user.uid);
            if (y.uid === user.uid) {
              console.log("worked");
              return true;
            }
          }
          return false;
        })
      : null;
    if (convoList && !convoList.length) setConvoList(list);
  };
  useEffect(() => {
    getConvoList();
  }, [convoList, user.uid]);

  useEffect(() => {
    // // console.log(convoList[0]);
    // convoList.sort((a, b) => {
    //   let aLength = a.message.length - 1;
    //   let bLength = b.message.length - 1;
    //   if (a.message[aLength].time < b.message[bLength].time) {
    //     return true;
    //   } else return false;
    // });
    // console.log(convoList);
    if (convoList && convoList.length) setActiveConvo(convoList[0]);
  }, [convoList]);

  const checkMessage = (e) => {
    const input = e.target.value.trim();
    const button = document.querySelector("#msginputbut");
    if (input) {
      button.classList.remove("disabled");
      button.removeAttribute("disabled");
    } else {
      button.classList.add("disabled");
      button.disabled = true;
    }
  };

  const sendMessage = async (e) => {
    const input = document.querySelector("#messagesinput");
    let data = await (await get(ref(db, "messages/"))).val();
    let index = 0;
    if (data) {
      for (let item of data) {
        console.log(item.members.map((x) => x.uid));
        if (
          item.members.map((x) => x.uid).includes(activeConvo.members[0].uid) &&
          item.members.map((x) => x.uid).includes(activeConvo.members[1].uid)
        ) {
          let newData = { ...data[index] };
          let toId =
            user.uid !== activeConvo.members[0].uid
              ? activeConvo.members[0].uid
              : activeConvo.members[1].uid;
          let toData = await (await get(ref(db, `users/${toId}`))).val();
          newData.message.push({
            from: user.uid,
            fromPhoto: user.photo,
            text: input.value,
            to: toId,
            toPhoto: toData.photo,
            time: new Date().getTime(),
          });
          await set(ref(db, `messages/${index}/`), newData);
          input.value = "";

          let convoTexts = { ...activeConvo };
          convoTexts.message = newData.message;
          console.log(convoTexts, activeConvo);
          let newConvoList = convoList;
          newConvoList[index] = convoTexts;
          console.log(newConvoList);

          let notifData = await (
            await get(ref(db, `notifications/${toId}`))
          ).val();
          let newNotifData = {
            read: false,
            notifs: notifData
              ? [
                  ...notifData.notifs,
                  {
                    by: user.uid,
                    type: "messages",
                    url: "messages",
                    time: new Date().getTime(),
                  },
                ]
              : [
                  {
                    by: user.uid,
                    type: "message",
                    url: "mtessages",
                    time: new Date().getTime(),
                  },
                ],
          };
          console.log(newNotifData);
          await set(ref(db, `notifications/${toId}/`), newNotifData);

          setActiveConvo(convoTexts);
          setConvoList(newConvoList);
          return;
          // setUpdate(update + 1)
        }
        index++;
      }
    }
    let newData = {};
    console.log(activeConvo.members);
    let toId =
      user.uid !== activeConvo.members[0].uid
        ? activeConvo.members[0].uid
        : activeConvo.members[1].uid;
    console.log(toId);
    let toData = await (await get(ref(db, `users/${toId}`))).val();
    console.log(toData);
    newData.members = activeConvo.members;
    newData.message = [
      {
        from: user.uid,
        fromPhoto: user.photo,
        text: input.value,
        to: toId,
        toPhoto: toData.photo,
        time: new Date().getTime(),
      },
    ];
    if (!data) index = 0;
    else index = data.length;
    await set(ref(db, `messages/${index}/`), newData);
    input.value = "";

    let convoTexts = { ...activeConvo };
    convoTexts.message = newData.message;
    console.log(convoTexts, activeConvo);
    let newConvoList = convoList;
    newConvoList[index] = convoTexts;
    console.log(newConvoList);

    setActiveConvo(convoTexts);
    setConvoList(newConvoList);
  };

  return (
    <div className="messagesholder">
      {messageModal ? (
        <MessageModalContext.Provider value={messageModal}>
          <SetMessageModalContext.Provider value={setMessageModal}>
            <SetActiveConvoContext.Provider value={setActiveConvo}>
              <ActiveConvoContext.Provider value={activeConvo}>
                <MessageModal
                  convoList={convoList}
                  setConvoList={setConvoList}
                />
              </ActiveConvoContext.Provider>
            </SetActiveConvoContext.Provider>
          </SetMessageModalContext.Provider>
        </MessageModalContext.Provider>
      ) : null}
      <div className="messageprofiles">
        <div className="messageheader">
          <div>Messages</div>
          <Edit onClick={() => setMessageModal(true)} />
        </div>
        <div className="conversationlist">
          {convoList
            ? convoList
                .sort((a, b) => {
                  if (!a.message || !b.message) return false;
                  let aLength = a.message.length - 1;
                  let bLength = b.message.length - 1;
                  if (a.message[aLength].time > b.message[bLength].time) {
                    return false;
                  } else return true;
                })
                .map((x) => {
                  let data = {};
                  x.members.forEach((ele, index) => {
                    if (ele.uid === user.uid) {
                      let num = 0;
                      if (index === 0) num = 1;
                      data.photo = x.members[num].photo;
                      data.uid = x.members[num].uid;
                    }
                  });
                  return (
                    <div onClick={() => setActiveConvo(x)} key={uniqid()}>
                      <img
                        src={data.photo}
                        alt=""
                        height="25px"
                        width="25px"
                      ></img>
                      <div>
                        <div>{data.uid}</div>
                        {x.message ? x.message[x.message.length - 1].text.substring(0, 10): null}
                      </div>
                    </div>
                  );
                })
            : null}
        </div>
      </div>

      <div className="conversationholder">
        <div className="conversationmessage">
          <textarea
            id="messagesinput"
            onInput={(e) => {
              checkMessage(e);
            }}
            placeholder="New Message"
          ></textarea>
          <div
            id="msginputbut"
            className="disabled"
            disabled
            onClick={(e) => sendMessage(e)}
          >
            Send
          </div>
        </div>
        <div className="fromtomessageholder">
          {activeConvo.message && activeConvo.message.length
            ?
            activeConvo.message
            // .sort((a, b) => {
            //   if (a.time < b.time) return true;
            //   else return false;
            // })
            .map((msg) => {
                if (msg.from === user.uid) {
                  return (
                    <div className="frommessageholder" key={uniqid()}>
                      <div className="frommessage">
                        <img
                          src={msg.fromPhoto}
                          alt=""
                          height="40px"
                          width="40px"
                        ></img>
                        <div>{msg.text}</div>
                      </div>
                    </div>
                  );
                } else {
                  return (
                    <div className="tomessageholder" key={uniqid()}>
                      <div className="tomessage">
                        <img
                          src={msg.toPhoto}
                          alt=""
                          height="40px"
                          width="40px"
                        ></img>
                        <div>{msg.text}</div>
                      </div>
                    </div>
                  );
                }
              })
            : null}
        </div>
      </div>
    </div>
  );
};

const MessageModal = ({ convoList, setConvoList }) => {
  const user = useContext(UserContext);
  const db = useContext(DbContext);
  const setMessageModal = useContext(SetMessageModalContext);
  const setActiveConvo = useContext(SetActiveConvoContext);
  const activeConvo = useContext(ActiveConvoContext);
  const [dmableList, setDmableList] = useState([]);

  const getData = async () => {
    let userFollowingData = (
      await get(ref(db, `users/${user.uid}/following`))
    ).val();
    let list = [];
    for (let x of userFollowingData) {
      let data = (await get(ref(db, `users/${x}/`))).val();
      if (data.following.includes(user.uid))
        list.push({ uid: data.uid, name: data.name, photo: data.photo });
    }
    setDmableList(list);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="modal">
      <div className="messagemodal">
        <div className="messagemodalheader">
          <div>New Message</div>
          <CloseOutlined onClick={() => setMessageModal(false)} />
        </div>

        <div className="messagemodalitemsholder">
          {dmableList.map((x) => {
            return (
              <div
                key={uniqid()}
                className="messagemodalitem"
                onClick={() => {
                  console.log(x.uid);
                  if (convoList) {
                    for (let item of convoList) {
                      console.log(item.members.map((y) => y.uid));
                      if (item.members.map((y) => y.uid).includes(x.uid)) {
                        console.log("there already");
                        return;
                      }
                    }
                  }
                  if (convoList) {
                    let item = convoList;
                    item.push({
                      members: [
                        { uid: x.uid, photo: x.photo },
                        { uid: user.uid, photo: user.photo },
                      ],
                    });
                    setConvoList(item);
                  } else {
                    setConvoList([
                      {
                        members: [
                          { uid: x.uid, photo: x.photo },
                          { uid: user.uid, photo: user.photo },
                        ],
                      },
                    ]);
                  }
                  setActiveConvo({
                    members: [
                      { uid: x.uid, photo: x.photo },
                      { uid: user.uid, photo: user.photo },
                    ],
                  });
                }}
              >
                <img src={x.photo} alt="" height="50px" width="50px"></img>
                <div>
                  <div>{x.name}</div>
                  <div>@{x.uid}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Messages;
