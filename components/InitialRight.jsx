import Image from 'next/image'
import chatImage from "../public/images/chat_image.png"

export default function InitialRight({ setIsNav }) {
  return (
    <>
      <div onClick={() => setIsNav(true)} className="burger-menu">
        <span />
        <span />
        <span />
      </div>
      <div className="initial-right">
        <div className="img-holder">
          <Image src={chatImage} layout='fill' alt="chat image" />
        </div>
        <p>Chat with someone</p>
      </div>
    </>
  )
}
