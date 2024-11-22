import { motion } from "framer-motion"
import Image from "next/image"
import { useChat } from "./ChatContext"
import defaultUserIcon from "../public/images/user_photo.png"

export default function User({ uid, username, profilePhotoURL, delay, combinedId, handleSelect, lastMessage, setIsNav }) {
  const { userInfo } = useChat();

  return (
    <motion.div
      layout

      onClick={() => `${handleSelect(combinedId, profilePhotoURL, username, uid)} ${setIsNav(false)}`}
      initial={{
        y: 150,
        opacity: 0,
      }}

      animate={{
        y: 0,
        opacity: 1,
      }}

      transition={{
        delay: delay * .1
      }}
      className={`user ${userInfo.uid === uid ? "selected" : ""}`}
    >
      <div className="user-image">
        <Image src={profilePhotoURL || defaultUserIcon} layout="fill" alt="profile photo" />
      </div>
      {lastMessage && <span>{lastMessage}</span>}
      <p>{username}</p>
    </motion.div>
  )
}
