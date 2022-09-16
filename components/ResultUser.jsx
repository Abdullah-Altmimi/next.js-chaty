import { motion } from "framer-motion"
import Image from "next/image"
import defaultUserIcon from "../public/images/user_photo.png"

export default function ResultUser({ uid, delay, profilePhotoURL, name, onClick }) {
  return (
    <motion.div onClick={() => onClick({ uid, profilePhotoURL, username: name })}
      initial={{
        x: "-100%",
        opacity: .4
      }}

      animate={{
        x: 0,
        opacity: 1
      }}

      transition={{
        delay: delay * .2,
        type: "tween"
      }}

      className="result-user"
    >
      <div className="user-image">
        <Image src={profilePhotoURL || defaultUserIcon} layout="fill" alt="user photo" />
      </div>
      <p>{name}</p>
    </motion.div>
  )
}
