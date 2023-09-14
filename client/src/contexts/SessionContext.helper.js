import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import useLocalStorage from './useLocalStorage'

export const useAuthentication = () => {
  const [isSignedIn, setSignedIn] = useState(null)
  const [userData, setUserData] = useLocalStorage('userdata')
  const [isLoading, setIsLoading] = useState(true)

  async function CheckAuth () {
    const sessionAccess = await fetch('/api/auth/access')
    const sessionAccessData = await sessionAccess.json()
    setSignedIn(sessionAccessData.message === 'Authorized!')
    setIsLoading(false)
  }

  useEffect(() => {
    CheckAuth()
  }, [isSignedIn])

  const signin = () => setSignedIn(true)
  const signout = () => {
    setSignedIn(false)
    setUserData(null)
    localStorage.clear()
    Cookies.remove('session')
    Cookies.remove('session.sig')
  }

  return { isSignedIn, isLoading, signin, signout, userData, setUserData }
}
