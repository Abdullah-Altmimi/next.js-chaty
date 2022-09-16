import { useRef, useState, useEffect } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../components/firebase';
import { useAuth } from '../components/AuthContext';
import Router from 'next/router';
import showIcon from "../public/images/open_eye.png";
import hideIcon from "../public/images/close_eye.png";
import Image from "next/image";
import Link from 'next/link';


export default function Login() {
  const [isShow, setIsShow] = useState(false);
  const [error, setError] = useState(false);
  const { currentUser } = useAuth();
  
  useEffect(() => {
    if (currentUser) {
      Router.push("/")
    }
  },[currentUser])

  const [form, setForm] = useState({
    email:"",
    password: ""
  });
  const password = useRef(null);
  
  function handleChange(event) {
    setForm(prev => ({
      ...prev,
      [event.target.name]: event.target.value,
    }))
  }

  function handlePasswordShowing() {
    setIsShow(!isShow);
    if (!isShow) {
      password.current.type = "text"
    } else {
      password.current.type = "password"
    }
  }
  
  function login() {
    signInWithEmailAndPassword(auth, form.email, form.password).then(() => {
      setError(false);
    }).catch(err => {
      const message = err.code.split("/")[1].split("-").join(" ");
      setError(message);
    })
  }
                
  return (
    <div className="sign-container">
      <div className="sign-card">
        <h1>Login</h1>
        <form onSubmit={e => e.preventDefault()}>
          <label>
            <input name='email' value={form.email} onChange={handleChange} type="text" />
            <span className={form.email.length > 0 ? "active" : ""}>Emall</span>
          </label>
          <label>
            <div onClick={handlePasswordShowing} className="image-container">
             <Image src={isShow ? showIcon : hideIcon} alt="show hide Password" />
            </div>
            <input ref={password} value={form.password} name="password" onChange={handleChange} type="password" />
            <span className={form.password.length > 0 ? "active" : ""}>Password</span>
            <div className='support'>
              <div>
              <Link href="Register">Register</Link> 
              <Link href="Reset_Password"> Forgot your password ?</Link>
              </div>
              {error && <p className='error'>{error}</p>}
            </div> 
          </label>
          <button style={{display: "none"}} onClick={login}>Login</button>
        </form>
        <button onClick={login}>Login</button>
      </div>
    </div>
  )
}

Login.getLayout = (page) => page;
