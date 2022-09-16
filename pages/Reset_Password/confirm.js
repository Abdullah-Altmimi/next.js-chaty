import { useState } from "react"
import FancyInput from "../../components/FancyInput"
import { confirmPasswordReset } from "firebase/auth"
import { auth } from "../../components/firebase";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Confirm({params}) {

  const router = useRouter()
  
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    password: "",
    confirmPassword: ""
  })

  function handleChange(event) {
    setForm(prev => ({
      ...prev,
      [event.target.name]: event.target.value
    }))

  }

  const sendResetPassword = () => {
    if (form.confirmPassword !== form.password) {

      return setError("Password not match")
    }
    confirmPasswordReset(auth, params.oobCode, form.password).then(res => {
      router.push("/Login")
    }).catch(err => {
      if (err.code == "auth/expired-action-code") {
        return setError("expired request")
      }
      console.dir(err)
      const message = err.code.split("/")[1].split("-").join(" ");
      setError(message)
    })
  }

  return (
    <div className="reset-password-container">
      <div className="reset-card">
        <h1>Reset password</h1>
        <form onSubmit={e => e.preventDefault()}>
            <div className="inputs-holder">
              <FancyInput handleChange={handleChange} name="password" value={form.password} placeHolder="New Password" />
              <FancyInput password handleChange={handleChange} name="confirmPassword" value={form.confirmPassword} placeHolder="Confirm Password" />
            </div>
            <div className='support'>
              <div>
                <Link href="/Register">Register</Link>
                <Link href="/Login">Login</Link>
              </div>
              {error && <p className='error'>{error}</p>}
            </div> 
          <button style={{display: "none"}} onClick={sendResetPassword}>Login</button>
        </form>
        <button onClick={sendResetPassword}>Reset</button>
      </div>
    </div>
    )
  }
  
  export async function getServerSideProps(context) {
    const { query } = context
  
    return {
      props: {params: query}
      
    };
  }