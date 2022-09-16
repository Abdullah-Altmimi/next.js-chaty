import Image from "next/image";
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useAuth } from './AuthContext';
import { useChat } from './ChatContext';
import imageIcon from "../public/images/image_icon.png";
import { storage } from "./firebase";

export default function ChatSection({ setIsNav }) {
  const [text, setText] = useState("")
  const { userInfo, messages, chatId, addMessage, batchUpdate, resetChat, batchCommit, deleteFriend } = useChat()
  const { updateChatData, currentUser } = useAuth()
  const lastMsg = useRef();
  const [isOptions, setIsOptions] = useState(false);
  const [error, setError] = useState("");

  function deleteMessages() {
    resetChat();
  }

  useEffect(() => {
    let timeout;
    if (error) {
      timeout = setTimeout(() => setError(false), 2000);
    }
    return () => clearTimeout(timeout);
  }, [error])

  useEffect(() => {
    lastMsg.current?.scrollIntoView({ block: "center", behavior: "smooth" })
    if (messages.length === 0) return;
    const LAST_MESSAGE = messages[messages.length - 1]

    if (LAST_MESSAGE.senderId !== currentUser.data.uid && LAST_MESSAGE.profilePhotoURL !== userInfo.profilePhotoURL) {
      updateChatData(currentUser.data.uid, {
        [chatId + ".userInfo.profilePhotoURL"]: LAST_MESSAGE.profilePhotoURL,
        [chatId + ".userInfo.username"]: LAST_MESSAGE.username,
      })
    } else if (LAST_MESSAGE.senderId !== currentUser.data.uid && LAST_MESSAGE.username !== userInfo.username) {
      updateChatData(currentUser.data.uid, {
        [chatId + ".userInfo.username"]: LAST_MESSAGE.username
      })
    }

  }, [messages]);

  function handleSend() {
    if (!text) return;

    batchUpdate("chatUser", currentUser.data.uid, {
      [chatId + ".date"]: Date.now(),
      [chatId + ".userInfo.lastMessage"]: text
    })
    batchUpdate("chatUser", userInfo.uid, {
      [chatId + ".date"]: Date.now(),
      [chatId + ".userInfo.lastMessage"]: text
    })
    addMessage({
      text,
      senderId: currentUser.data.uid,
      id: Date.now(),
      profilePhotoURL: currentUser.data.profilePhotoURL,
      username: currentUser.data.username,

    })
    batchCommit();
    setText("");
  }

  function handleFile(event) {
    setError(false);
    const file = event.target.files[0];
    if (!file?.type) return setError("Something wrong");

    const MB_SIZE = 500000;
    if (file.type.includes("image") && file.size <= MB_SIZE) {
      const storageRef = ref(storage, `images/${file.name}_${file.size}`)
      setError("Loading")
      uploadBytes(storageRef, file)
        .then(() => {
          getDownloadURL(storageRef)
            .then(res => addMessage({
              senderId: currentUser.data.uid,
              id: Date.now(),
              profilePhotoURL: currentUser.data.profilePhotoURL,
              username: currentUser.data.username,
              image: res
            })).then(() => batchCommit()).then(() => setError("sended !"));

        })
        .finally(() => setError(false))
      return;
    } else if (file.size > MB_SIZE) {
      console.log("Large size")
      return setError("Large file")

    } else if (!file.type.includes("image")) {
      console.log("Not image");
      return setError("Not image");
    }
    return setError(false)
  }

  return (
    <>
      {isOptions && <div className="overlay" onClick={() => setIsOptions(false)} />}
      <div className='chat-container'>
        <header>
          <div onClick={() => setIsNav(true)} className="burger-menu">
            <span />
            <span />
            <span />
          </div>
          <div className='userInfo'>
            <div className={`dots ${isOptions ? "active" : ""}`} onClick={() => setIsOptions(true)}>
              <span />
              <span />
              <span />
              {isOptions &&
                <motion.div animate={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: "-20%" }} transition={{ type: "tween", duration: .4 }} className="options">
                  <p onClick={deleteFriend}>Delete friend</p>
                  <p onClick={deleteMessages}>Delete all chat</p>
                </motion.div>
              }
            </div>
            <div className='user-data'>
              <p>{userInfo.username}</p>
              <div className="img-holder">
                <Image src={userInfo.profilePhotoURL} alt="profile image" layout="fill" />
              </div>
            </div>
          </div>
        </header>
        <div ref={lastMsg} className="messages-container">
          {messages && messages.map(el =>
            el?.image ? <div key={el.id} ref={lastMsg} className={el.senderId === currentUser.data.uid ? "message owner image" : "message image"}><Image src={el.image} alt="image" layout="fill" /></div> :
              <div key={el.id} ref={lastMsg} className={el.senderId === currentUser.data.uid ? "message owner" : "message"}>{el.text}</div>)}
        </div>
        <footer>
          <form onSubmit={event => event.preventDefault()}>
            <motion.div className="error"
              initial={{
                y: "100%",
                x: "-50%",
                opacity: 0
              }}
              animate={{
                y: error ? 0 : "130%",
                x: "-50%",
                opacity: error ? 1 : 0
              }}

              transition={{

              }}
            >{error}</motion.div>
            <input placeholder='message' type="text" value={text} onChange={event => setText(event.target.value)} />
            <button onClick={() => handleSend()}>Send</button>
            <label className="icon-holder">
              <Image src={imageIcon} alt="add image icon" layout="fill" />
              <input accept=".jpg, .jpeg, .png, .webp, .svg, .jfif , .pjpeg , .pjp" onChange={event => handleFile(event)} style={{ display: "none" }} type="file" />
            </label>
          </form>
        </footer>
      </div>
    </>
  )
}
