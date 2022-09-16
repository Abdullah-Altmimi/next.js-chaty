import { useState } from 'react'
import Image from "next/image"
import { motion } from "framer-motion"
import { signOut } from 'firebase/auth';
import signOutIcon from "../public/images/logout.png";
import { auth } from "./firebase"
import { useAuth } from './AuthContext';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./firebase"
import defaultProfilePhoto from "../public/images/user_photo.png";


export default function Profile({ setShowProfile, showProfile, currentUser }) {

  const [isLogOut, setIsLogOut] = useState(false);
  const [error, setError] = useState(false);
  const { updateCurrentUserData } = useAuth();
  const [form, setForm] = useState({
    username: currentUser?.data?.username || "",
    bio: currentUser?.data?.bio || ""
  });

  function handleFile(event) {
    setError(false);
    const file = event.target.files[0];
    if (!file?.type) return setError("Something wrong");

    const MB_SIZE = 800000;
    if (file.type.includes("image") && file.size <= MB_SIZE) {
      const storageRef = ref(storage, `images/${file.name}_${file.size}`)
      setError("Loading")
      uploadBytes(storageRef, file)
        .then(() => {
          getDownloadURL(storageRef)
            .then(res => updateCurrentUserData({ profilePhotoURL: res }));
        })
        .finally(() => setError(false))
      return;
    } else if (file.size > MB_SIZE) {
      console.log("file to big")
      return setError("The file size is large")

    } else if (!file.type.includes("image")) {
      console.log("file not image");
      return setError("the file type is not image");
    }
    return setError(false)
  }

  function handleForm(event) {
    setForm(prev => ({
      ...prev,
      [event.target.name]: event.target.value
    }))
  }

  const handleSubmit = () => {
    updateCurrentUserData(form)
  }


  return (
    <>
      {isLogOut && <>
        <div className="overlay" onClick={() => setIsLogOut(false)} />
        <motion.div className="logout-popup">
          <div>
            <h2>Sign out</h2>
            <div className="yes-no">
              <button onClick={() => setIsLogOut(signOut(auth))}>Yes</button>
              <button onClick={() => setIsLogOut(setIsLogOut(false))}>No</button>
            </div>
          </div>
        </motion.div>
      </>}

      <motion.div className="profile-container"
        initial={{
          x: "-100%"
        }}
        animate={{
          x: showProfile ? 0 : "-100%",
          display: showProfile ? "block" : "none",
          transition: {
            display: !showProfile && { delay: 1 },
            type: 'spring',
            bounce: 0
          }
        }}

      >
        <div className='profile'>
          <svg onClick={() => setShowProfile(false)} width="50.682" height="45.534" viewBox="0 0 50.682 45.534">
            <line x1="46" transform="translate(2.682 22.827)" fill="none" stroke="#0077b6" strokeLinecap="round" strokeWidth="4" />
            <path d="M20,0S1.111,17.774,0,20" transform="translate(2.682 2.827)" fill="none" stroke="#0077b6" strokeLinecap="round" strokeWidth="4" />
            <path d="M20,0S1.493,20.22.119,19.748" transform="translate(22.438 22.708) rotate(90)" fill="none" stroke="#0077b6" strokeLinecap="round" strokeWidth="4" />
          </svg>

          <div className="sign-out" onClick={() => setIsLogOut(true)}>
            <Image src={signOutIcon} alt="sign out exit" />

          </div>
          <div className="img-holder">
            <Image alt='user image' layout='fill' src={currentUser?.data?.profilePhotoURL || defaultProfilePhoto} />
          </div>
          <label >
            {error && <p className='error'>{error}</p>}
            <p>Change profile photo</p>
            <input type="file" name="file" accept=".jpg, .jpeg, .png, .webp, .svg, .jfif , .pjpeg , .pjp" onChange={handleFile} style={{ display: "none" }} />
          </label>
          <form onSubmit={e => `${e.preventDefault()}`}>
            <label htmlFor="username">
              Username
              <div className="input-holder">
                <input onChange={handleForm} name="username" value={form.username} type="text" />
                <svg width="25.095" height="27.598" viewBox="0 0 25.095 27.598">
                  <g id="Group_3" data-name="Group 3" transform="translate(-522.596 -381.77)">
                    <path id="Path_6" data-name="Path 6" d="M648.5,2967.064l-11.04,11.838-5.945,3.744,2.087-7.069,15.7-16.759,3.724,2.926Z" transform="translate(-106.05 -2576.371)" fill="none" stroke="#00a8e8" strokeWidth="1" />
                    <path id="Path_7" data-name="Path 7" d="M634.251,2979.25l4.005,2.841" transform="translate(-106.526 -2579.924)" fill="none" stroke="#00a8e8" strokeWidth="1" />
                    <path id="Path_8" data-name="Path 8" d="M651.839,2960.533l3.633,2.98" transform="translate(-109.584 -2576.669)" fill="none" stroke="#00a8e8" strokeWidth="1" />
                    <path id="Path_9" data-name="Path 9" d="M655.2,3046.4l-2.217-2.75,2.217-1.094,2.423,2.266Z" transform="translate(-130 -2637.369)" fill="none" stroke="#00a8e8" strokeWidth="0.5" />
                  </g>
                </svg>
              </div>
            </label>
            {/* <label htmlFor="bio">
              Bio
              <div className="input-holder">
                <textarea onChange={handleForm} name="bio" value={form.bio} type="text" />
              </div>
            </label> */}
            <button onClick={handleSubmit}>Submit</button>
          </form>
        </div>
      </motion.div>
    </>
  )
}
