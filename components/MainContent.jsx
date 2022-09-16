import { useState } from 'react'
import Image from 'next/image'
import { useAuth } from './AuthContext';
import { useChat } from './ChatContext';
import Profile from "./Profile"
import defaultProfilePhoto from "../public/images/user_photo.png";
import ResultUser from './ResultUser';
import searchIcon from "../public/images/search_icon.png"
import User from './User'
import InitialRight from './InitialRight';
import ChatSection from "./ChatSection";


export default function MainContent() {
  const [showProfile, setShowProfile] = useState(false);
  const [username, setUsername] = useState("");
  const [resultUser, setResultUser] = useState([]);
  const [isNav, setIsNav] = useState(false);
  const { currentUser, searchUser } = useAuth();
  const { userChats, dispatch, chatId, addFriend, userInfo } = useChat();

  console.log(userChats)

  const handleSearch = event => {
    if (username.length === 0) setResultUser([]);
    if (event?.code !== "Enter" && event?.code) return;
    searchUser(username).then(e => {
      let result = [];
      e.forEach(doc => doc.id !== currentUser.data.uid && result.push(doc.data()))

      setResultUser(result);
      setUsername("");
    })
  }

  function handleSelect(combinedId, profilePhotoURL, username, uid) {
    dispatch({ action: "setUserInfo", userInfo: { combinedId, profilePhotoURL, username, uid } })
  }

  function handleAdd(user) {
    addFriend(user).then(() => setResultUser([]));;
  }

  return (
    <div className='container'>
      <div className={`left ${isNav ? "show" : 'hide'}`}>

        {/* profile trigger */}
        <Profile showProfile={showProfile} setShowProfile={setShowProfile} currentUser={currentUser} />

        <header>

          <div className="img-holder">
            <Image src={currentUser.data?.profilePhotoURL || defaultProfilePhoto} alt="profile photo" layout='fill' onClick={() => setShowProfile(true)} />
          </div>
          <p>{currentUser.data?.username}</p>
        </header>
        <div className="search-users">
          <label>
            <div className="icon" onClick={() => handleSearch()}>
              <Image layout='responsive' src={searchIcon} alt="search" />
            </div>
            <input onKeyPress={e => handleSearch(e)} value={username} onChange={e => setUsername(e.target.value)} type="text" placeholder='Find someone' />
          </label>
          {/* <ResultUser /> */}
          {resultUser.map((ob, index) => <ResultUser uid={ob.uid} delay={index} key={ob.uid} name={ob.username} profilePhotoURL={ob.profilePhotoURL} onClick={handleAdd} />)}
        </div>
        <div className='users-holder'>
          {Object.entries(userChats).length >= 1 &&
            Object.entries(userChats).sort((a, b) => b[1].date - a[1].date).map((doc, index) =>
              <User setIsNav={setIsNav} lastMessage={doc[1].userInfo.lastMessage} delay={index}
                profilePhotoURL={doc[1].userInfo.profilePhotoURL} combinedId={doc[0]}
                username={doc[1].userInfo.username} handleSelect={handleSelect} uid={doc[1].userInfo.uid}
                key={doc[0]}
              />)
          }
        </div>
      </div>
      <div className="right">
        {!chatId && <InitialRight setIsNav={setIsNav} />}
        {chatId && <ChatSection setIsNav={setIsNav} />}
        {/* <ChatSection /> */}
      </div>
    </div>

  )
}
