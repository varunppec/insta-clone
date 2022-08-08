import uniqid from "uniqid";
import { CloseOutlined, EditOutlined as Edit } from "@material-ui/icons";
import { get, onValue, ref, set } from "firebase/database";
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

const getCommentTimeDiff = (commTime) => {
  let time = new Date().getTime() - commTime;
  let test = 0;
  test = Math.floor(time / (1000 * 60 * 60 * 24 * 7 * 4 * 12));
  if (test !== 0) {
    return `${test}y`;
  }
  test = Math.floor(time / (1000 * 60 * 60 * 24 * 7 * 4));
  if (test !== 0) {
    return `${test}M`;
  }
  test = Math.floor(time / (1000 * 60 * 60 * 24 * 7));
  if (test !== 0) {
    return `${test}w`;
  }
  test = Math.floor(time / (1000 * 60 * 60 * 24));
  if (test !== 0) {
    return `${test}d`;
  }
  test = Math.floor(time / (1000 * 60 * 60));
  if (test !== 0) {
    return `${test}h`;
  }
  test = Math.floor(time / (1000 * 60));
  if (test !== 0) {
    return `${test}m`;
  }
  test = Math.floor(time / 1000);
  if (test !== 0) {
    return `${test}s`;
  }
  return `now`;
};

const Messages = () => {
  const db = useContext(DbContext);
  const user = useContext(UserContext);
  const [update, setUpdate] = useState(0);
  const [messageModal, setMessageModal] = useState(false);
  const [activeConvo, setActiveConvo] = useState({});
  const [convoList, setConvoList] = useState([]);
  console.log(convoList);
  useEffect(() => {
    console.log(convoList);
    onValue(ref(db, "messages"), (snapshot) => {
      let list = snapshot.val()
        ? snapshot
            .val()
            .filter((x) => {
              for (let y of x.members) {
                if (y.uid === user.uid) {
                  return true;
                }
              }
              return false;
            })
            .sort((a, b) => {
              if (!a.message || !b.message) return false;
              let aLength = a.message.length - 1;
              let bLength = b.message.length - 1;
              if (a.message[aLength].time > b.message[bLength].time) {
                return false;
              } else return true;
            })
        : null;
      console.log(list);
      if (convoList && !convoList.length) {
        setConvoList(list);
        if (!activeConvo || !activeConvo.members) setActiveConvo(list[0]);
        else setActiveConvo(list[convoList.indexOf(activeConvo)]);
        return;
      }

      for (let item of list) {
        for (let ele of convoList) {
          if (ele.message.length !== item.message.length) {
            setConvoList(list);
            setActiveConvo(list[convoList.indexOf(activeConvo)]);
            return;
          }
        }
      }
    });
  }, [user.uid]);

  const checkMessage = (e) => {
    const input = e.target.value.trim();
    const button = document.querySelector("#msginputbut");
    if (input) {
      button.classList.remove("disabled");
      button.removeAttribute("disabled");
    } else {
      button.classList.add("disabled");
      button.setAttribute("disabled", true);
    }
  };

  const sendMessage = async (e) => {
    const input = document.querySelector("#messagesinput");
    let data = await (await get(ref(db, "messages/"))).val();
    let index = 0;
    if (!input.value) {
      e.target.setAttribute("disabled", true);
      return;
    }
    if (data) {
      for (let item of data) {
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

          input.value = "";

          let convoTexts = { ...activeConvo };
          convoTexts.message = newData.message;
          let newConvoList = convoList;
          console.log("before", newConvoList);
          newConvoList[index] = convoTexts;
          console.log("after", newConvoList);

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
          await set(ref(db, `notifications/${toId}/`), newNotifData);
          await set(ref(db, `messages/${index}/`), newData);
          return;
        }
        index++;
      }
    }
    let newData = {};
    let toId =
      user.uid !== activeConvo.members[0].uid
        ? activeConvo.members[0].uid
        : activeConvo.members[1].uid;
    let toData = await (await get(ref(db, `users/${toId}`))).val();
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
    input.value = "";
    await set(ref(db, `messages/${index}/`), newData);
  };
  if (activeConvo)
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
                          {x.message
                            ? x.message[x.message.length - 1].text.substring(
                                0,
                                10
                              )
                            : null}
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
              disabled={true}
              onClick={(e) => {
                console.log(convoList);
                sendMessage(e);
              }}
            >
              Send
            </div>
          </div>
          <div className="fromtomessageholder">
            {activeConvo.message && activeConvo.message.length
              ? activeConvo.message.map((msg) => {
                  if (msg.from === user.uid) {
                    return (
                      <div className="frommessageholder" key={uniqid()}>
                        <div className="frommessage">
                          <div className="msgtime">
                            {getCommentTimeDiff(msg.time)}
                          </div>
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
                          <div className="msgtime">
                            {getCommentTimeDiff(msg.time)}
                          </div>
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
  else
    return (
      <div className="messagesholder">
        <div className="messageprofiles">
          <div className="messageheader">
            <div
              className="rectangle"
              style={{ width: "105px", height: "30px" }}
            ></div>
            <div
              className="rectangle"
              style={{ width: "21px", height: "21px" }}
            ></div>
          </div>
          <div className="conversationlist">
            <div>
              <div
                className="circle"
                style={{ width: "60px", height: "60px", margin: "10px" }}
              ></div>
              <div>
                <div
                  className="rectangle"
                  style={{ width: "170px", height: "30px" }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="conversationholder">
          <div className="conversationmessage">
            <div
              className="rectangle"
              style={{ width: "70%", height: "30px", borderRadius: "50px" }}
            ></div>
            <div className="disabled">Send</div>
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
                  if (convoList) {
                    for (let item of convoList) {
                      if (item.members.map((y) => y.uid).includes(x.uid)) {
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
