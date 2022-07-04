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
  const [messageModal, setMessageModal] = useState(false);
  const [activeConvo, setActiveConvo] = useState({});
  const [convoList, setConvoList] = useState([]);

  const getConvoList = async () => {
    let data = await (await get(ref(db, `messages`))).val();
    console.log(data);
    let list = data.filter((x) => {
      for (let y of x.members) {
        console.log(y.uid, user.uid);
        if (y.uid === user.uid) {
          console.log("worked");
          return true;
        }
      }
      return false;
    });
    if (!convoList.length) setConvoList(list);
  };

  useEffect(() => {
    getConvoList();
  }, [convoList.length, user.uid]);

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
          {convoList.map((x) => {
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
                <img src={data.photo} alt="" height="25px" width="25px"></img>
                <div>
                  <div>{data.uid}</div>
                  Hi I'm here to
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="conversationholder">
        <div className="conversationmessage">
          <textarea placeholder="New Message"></textarea>
          <div>Send</div>
        </div>
        {activeConvo.message
          ? activeConvo.message.map((msg) => {
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
                  setConvoList([
                    ...convoList,
                    {
                      members: [
                        { uid: x.uid, photo: x.photo },
                        { uid: user.uid, photo: user.photo },
                      ],
                    },
                  ]);
                  setActiveConvo({ members: [x.uid, user.uid] });
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
