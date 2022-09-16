import Link from 'next/link'
import {useRef, useState} from 'react'
import { auth } from '../../components/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';

export default function ResetPassword() {

  const [error, setError] = useState(null);
  const [email, setEmail] = useState("");


  const sendResetPassword = () => {
    if (!email.includes("@")) {
      return setError("invalid email");
    }
    sendPasswordResetEmail(auth, email,{handleCodeInApp: true,url: "http://localhost:3000/Reset_Password" })
    .then(res => {
      setError("Password reset email sent!")
    })
    .catch(err => {
      const message = err.code.split("/")[1].split("-").join(" ");    
      setError(message);
    })
  }

  // console.log(emailInput.current.value)

  return (
    <div className="reset-password-container">
      <div className="reset-card">
        <h1>Reset password</h1>
        <form onSubmit={e => e.preventDefault()}>
          <label>
            <input name='email' onChange={event => setEmail(event.target.value)} value={email} type="text" />
            <span className={email.length > 0 ? "active" : ""}>Emall</span>
          </label>
            <div className='support'>
              <div>
                <Link href="Register">Register</Link> 
                <Link href="Login">Login</Link>
              </div>
              {error && <p className='error'>{error}</p>}
            </div> 
          <button style={{display: "none"}} onClick={sendResetPassword}>Login</button>
        </form>
        <button onClick={sendResetPassword}>Send reset</button>
      </div>
    </div>
  )
}
