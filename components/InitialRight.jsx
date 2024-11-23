import Image from 'next/image'
import chatImage from "../public/images/chat_image.png"

export default function InitialRight() {
  return (
      <div className="initial-right">
        <div className="img-holder">
          <Image src={chatImage} layout='fill' alt="chat image" />
        </div>
        <p>Chat with someone</p>
      </div>
  )
}
