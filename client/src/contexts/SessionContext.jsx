import React, { createContext, useState } from 'react'
import Cookies from 'js-cookie'
import PropTypes from 'prop-types'
import useLocalStorage from './useLocalStorage'

const SessionContext = createContext()

const SessionProvider = ({ children }) => {
  const [isSignedIn, setSignedIn] = useState(!!Cookies.get('token'))
  const [userData, setUserData] = useLocalStorage('userdata')

  const signin = (accessToken) => {
    setSignedIn(true)
    document.cookie = `token=${accessToken}; path=/;`
  }

  const signout = () => {
    setSignedIn(false)
    setUserData(null)
    localStorage.clear()
    Cookies.remove('token')
    Cookies.remove('session')
    Cookies.remove('session.sig')
  }

  const handleUnauthorized = () => {
    signout()
  }

  const unauthorizedInterceptor = (response) => {
    if (response.status === 401) {
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
