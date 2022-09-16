import '../styles/index.scss'
import Head from 'next/head'
import { AuthProvider } from '../components/AuthContext'
import ChatContext from '../components/ChatContext';

function MyApp({ Component, pageProps }) {
  
  
  return (
    <>
      <Head>
        <title>app</title>
      </Head>
      <AuthProvider>
        <ChatContext>
          <Component {...pageProps} />
        </ChatContext>
      </AuthProvider>
    </>
  )
}

export default MyApp;
