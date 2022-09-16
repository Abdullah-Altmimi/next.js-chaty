import { doc, getDoc, onSnapshot, setDoc, updateDoc, arrayUnion, writeBatch, deleteField } from 'firebase/firestore';
import { createContext, useReducer, useContext, useEffect, useState } from 'react'
import { useAuth } from './AuthContext';
import { db } from './firebase';

const chatContext = createContext(null);

export const useChat = () => useContext(chatContext);

export default function ChatContext({children}) {
  const [prevChats, setPrevChats] = useState({});
  const { currentUser } = useAuth()

  const initialState = {
    chatId: null,
    userInfo: {},
    userChats: [],
    messages: [],
  }

  const dispatchFunction = (prev, paylod) => {
    switch (paylod.action) {
      case "setUserChats":
       return {...prev, userChats: paylod.userChats}
      case "setUserInfo":
        if (prev.chatId && prev.chatId !== paylod.userInfo.combinedId) {
          if (prevChats[paylod.userInfo.combinedId]) {
            return {...prev, chatId: paylod.userInfo.combinedId, userInfo: paylod.userInfo, messages: prevChats[paylod.userInfo.combinedId]}
          };
          return {...prev,chatId: paylod.userInfo.combinedId, userInfo: paylod.userInfo, messages: []};
        }
        return {...prev,chatId: paylod.userInfo.combinedId, userInfo: paylod.userInfo};
      case "setMessages":
        return {...prev, messages: paylod.messages}
      case "friendDeleted":
        return {...prev, userInfo: {}, chatId: null}

      default: return prev;
    }
  }

  const [state, dispatch] = useReducer(dispatchFunction, initialState);

  useEffect(() => {
    if (!currentUser?.data) return;
    let unsub = onSnapshot(doc(db, "chatUser", currentUser.data.uid), (res, err) => {
      dispatch({action: "setUserChats", userChats: res.data()})
      if (err) throw err;
    })

    return () => unsub();
  },[currentUser.data])

  // make the messages that have been fetched saved in prevChats(state) the every time 
  // user clicks to other user get the old messages until the new messages fetched if ther 
  // are exists

  useEffect(() => {
    if (!state.chatId) return;
    let unsub = onSnapshot(doc(db, "chats", state.chatId), (res) => {
      dispatch({action: "setMessages", ...res.data()})
      setPrevChats(prev => ({...prev, [state.chatId]: res.data().messages}));
    })
    return () => unsub();
  }, [state.chatId])

  async function createNewChat(combinedId) {
    await getDoc(doc(db, "chats", combinedId)).then(res => {
      if (!res.exists()) setDoc(doc(db, "chats", combinedId), {messages: []})
    });
  }

  const batch = writeBatch(db)
  
  function addMessage(message) {
    batch.update(doc(db, "chats", state.chatId), {
      "messages": arrayUnion(message)
    })
  }

  function deleteFriend() {
    batch.update(doc(db, "chatUser", currentUser.data.uid), {
      [state.chatId]: deleteField()
    });
    batch.update(doc(db, "chatUser", state.userInfo.uid), {
      [state.chatId]: deleteField()
    });
    dispatch({action: "friendDeleted"})
    batch.commit()
  }

  async function addFriend(user) {
    const combinedId = currentUser.user.uid > user.uid ?
    currentUser.user.uid + user.uid
    : user.uid + currentUser.user.uid;
    batch.update(doc(db,"chatUser", currentUser.user.uid), {
      [combinedId + ".userInfo"]: {
        ...user
      },
      [combinedId + ".date"]: Date.now()

    })
    
    batch.update(doc(db,"chatUser", user.uid), {
      [combinedId + ".userInfo"]: {
        uid: currentUser.data.uid,
        username: currentUser.data.username,
        profilePhotoURL: currentUser.data.profilePhotoURL
      },
      [combinedId + ".date"]: Date.now()
      
    })
    await createNewChat(combinedId);
    const res = await batch.commit();
    return res;
  }

  const batchUpdate = (collectionName, docName, data) => {
    batch.update(doc(db, collectionName, docName), data);
  }

  const batchCommit = async () => {
    const res = await batch.commit();
    return res;
  }

  const resetChat = () => {
    dispatch({action: "setMessages", messages: []})
    batch.update(doc(db, "chats", state.chatId), {
      "messages": []
    })
    batch.update(doc(db, "chatUser", currentUser.data.uid), {
      [state.chatId + ".userInfo.lastMessage"]: deleteField()
    });
    batch.update(doc(db, "chatUser", state.userInfo.uid), {
      [state.chatId + ".userInfo.lastMessage"]: deleteField()
    });
    batch.commit()
  }

  return (
    <chatContext.Provider
     value={{...state,
      dispatch,
      createNewChat,
      addMessage,
      resetChat,
      addFriend,
      deleteFriend,
      batchUpdate,
      batchCommit
      }}>
      {children}
    </chatContext.Provider>
  )
}
