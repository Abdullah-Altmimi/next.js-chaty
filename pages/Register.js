import Link from 'next/link'
import { useEffect, useState } from 'react'
import FancyInput from '../components/FancyInput';
import { auth } from "../components/firebase"
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useAuth } from '../components/AuthContext';
import Router from 'next/router';


export default function Register() {
  const [error, setError] = useState(false);
  const { currentUser, setUserDataByUid, setChatData } = useAuth();

  useEffect(() => {
    if (currentUser) Router.push("/")

  },[currentUser])

  const [form, setForm] = useState({
    username: "",
    email:"", 
    password: "",
    confirmPassword: "",
    bio: "hello i'm using chati"
  })

  function handleChange(event) {
    setForm(prev => ({
      ...prev,
      [event.target.name]: event.target.value,
    }))
  }

  function register() {
    
    if (form.password !== form.confirmPassword) {
      return setError("Password not match");
    } else if (form.username.length <= 1) {
      return setError("invalid username");
    }
    setError(false);
    
    createUserWithEmailAndPassword(auth, form.email, form.password).then(res => {
      setUserDataByUid(res.user.uid, { username: form.username, uid: res.user.uid, profilePhotoURL: "https://firebasestorage.googleapis.com/v0/b/chat-app-39706.appspot.com/o/images%2Ficon.png_22985?alt=media&token=2821a435-dfcb-494c-ba3e-bb83e151dc49" });
      setChatData(res.user.uid, {})
      setForm({
        username: "",
        email:"", 
        password: "",
        confirmPassword: ""
      });

    }).catch(err => {
      console.log(err.code)
      const message = err.code?.split("/")[1]?.split("-")?.join(" ");
      setError(message);
    })

    

  }


  return (
    <div className="sign-container register">
      <div className="sign-card">
        <h1>Register</h1>
        <div className="form-container">
          <form onSubmit={e => `${e.preventDefault()}`}>
            <FancyInput handleChange={handleChange}
            name="username" placeHolder="Username"
            value={form.username} 
            />
            <FancyInput handleChange={handleChange}
            name="email" placeHolder="Email"
            value={form.email} 
            />
            <FancyInput handleChange={handleChange}
            name="password" placeHolder="Password"
            value={form.password} password
            />
            <FancyInput handleChange={handleChange}
            name="confirmPassword" placeHolder="Confirm Password"
            value={form.confirmPassword} password 
            />
            <button style={{display: "none"}} onClick={register}>Register</button>
          </form>
          <div className='Y-10'>
            <Link href="Login">Do you Have an account ?</Link>
            {error && <p className='error'>{error}</p>}
          </div>
        </div>
        <button onClick={register}>Register</button>
      </div>
    </div>
  )
}

Register.getLayout = (page) => page;