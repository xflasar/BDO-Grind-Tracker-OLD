import React, { createContext, useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import PropTypes from 'prop-types'
import useLocalStorage from './useLocalStorage'

const SessionContext = createContext()

const SessionProvider = ({ children }) => {
  const [isSignedIn, setSignedIn] = useState(false)
  const [userData, setUserData] = useLocalStorage('userdata')

  async function CheckAuth () {
    const sessionAccess = await authorizedFetch('/api/auth/access')
    return sessionAccess
  }

  useEffect(() => {
    if (!isSignedIn) {
      CheckAuth().then((response) => {
        if (response.status === 200) {
          setSignedIn(true)
        } else {
          setSignedIn(false)
        }
      })
    }
  }, [])

  const signin = () => {
    setSignedIn(true)
  }

  const signout = () => {
    console.log('called signout')
    setSignedIn(false)
    setUserData(null)
    localStorage.clear()
    Cookies.remove('session')
    Cookies.remove('session.sig')
  }

  const handleUnauthorized = () => {
    signout()
  }

  const unauthorizedInterceptor = (response) => {
    if (response.status === 401) {
      handleUnauthorized()
    } else if (response.statusText === 'Forbidden') {
      handleUnauthorized()
    }
    return response
  }

  const authorizedFetch = async (url, options) => {
    const response = await fetch(url, options)
    return unauthorizedInterceptor(response)
  }

  const setSessionUserData = (userdata) => {
    setUserData(userdata)
  }

  const sessionContextValue = {
    isSignedIn,
    userData,
    signin,
    signout,
    authorizedFetch,
    setSessionUserData
  }

  return (
        <SessionContext.Provider value={sessionContextValue}>
            {children}
        </SessionContext.Provider>
  )
}

SessionProvider.propTypes = {
  children: PropTypes.any.isRequired
}

export { SessionContext, SessionProvider }
