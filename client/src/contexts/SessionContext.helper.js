import { useState } from 'react'
import Cookies from 'js-cookie'
import useLocalStorage from './useLocalStorage'

const CheckAuth = async () => {
  const sessionAccess = await fetch('/api/auth/access')
  const sessionAccessData = await sessionAccess.json()
  return sessionAccessData.message === 'Authorized!'
}

export const useAuthentication = () => {
  const [isSignedIn, setSignedIn] = useState(CheckAuth())
  const [userData, setUserData] = useLocalStorage('userdata')

  const signin = () => setSignedIn(true)
  const signout = () => {
    setSignedIn(false)
    setUserData(null)
    localStorage.clear()
    Cookies.remove('session')
    Cookies.remove('session.sig')
  }

  return { isSignedIn, signin, signout, userData, setUserData }
}
