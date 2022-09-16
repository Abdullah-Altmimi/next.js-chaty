import { AnimatePresence } from "framer-motion"
import Router from "next/router";
import { useEffect } from "react";
import { useAuth } from "../components/AuthContext";
import Loading from "../components/Loading";
import MainContent from "../components/MainContent";

export default function Home() {
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) Router.push("Login")
  }, [currentUser])

  return (
    <AnimatePresence>
      {currentUser === "Loading" && <Loading key="Loading" />}
      {currentUser?.user && <MainContent />}
    </AnimatePresence>
  )
}