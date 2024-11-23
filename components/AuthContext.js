import { doc, setDoc, onSnapshot, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { useContext, createContext, useState, useEffect } from 'react'
import { auth, db } from './firebase';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  
  const [currentUser, setCurrentUser] = useState("Loading");
  useEffect(() => {
    let unSub = () => "";

    const unsubscribe = auth.onAuthStateChanged(user => {
      if (!user) return setCurrentUser(false);
      const cancelListener = onSnapshot(doc(db, "users", user.uid), (res, err) => {
        setCurrentUser({user, data: res.data()})
        if (err) console.log(err);
      })

      // handle unSubscriber 
      unSub = () => `${unsubscribe()} ${cancelListener()}`
    })
    return () => unSub();
  },[])

  function setUserDataByUid(uid, data) {
    return setDoc(doc(db, "users", uid), data);
  }

  function updateCurrentUserData(data) {
    return updateDoc(doc(db, "users", currentUser.user.uid), data);
  }

  function setChatData(docName, data) {
    return setDoc(doc(db, "chatUser", docName), data);
  }

  async function updateChatData(docName, data) {
    const res = await updateDoc(doc(db, "chatUser", docName), data);
    return res;
  }

  async function searchUser(username) {
    const q = query(collection(db, "users"), where("username", "==", username));
  
    const querySnapshot = await getDocs(q);
    return querySnapshot;
  }
  

  const value = {
    currentUser,
    setUserDataByUid,
    updateCurrentUserData,
    searchUser,
    setChatData,
    updateChatData,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
