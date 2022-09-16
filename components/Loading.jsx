import { motion } from 'framer-motion';
import { useEffect, useState } from 'react'
import chatLogo from "../public/images/chat_logo.png"
import Image from 'next/image';

export default function Loading() {
  const [counter, setCounter] = useState(0);


  useEffect(() => {
    let timer;
    timer = setInterval(() => {
      setCounter(prev => prev + 3)
    }, 300)

    return () => clearInterval(timer);
  })

  return (
    <motion.div animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="loading">
      <div className="lightning">
        <span className="glow" />
        <span className="glow" />
        <span className="glow" />
        <div className="image"><Image width={50} height={50} src={chatLogo} alt="chat logo" /></div>
      </div>

      <div className="line">
        <span style={{ width: `${counter}%` }} />
      </div>
    </motion.div>
  )
}
