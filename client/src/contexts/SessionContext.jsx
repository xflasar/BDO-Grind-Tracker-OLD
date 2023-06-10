import React, { createContext, useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import PropTypes from 'prop-types'

const SessionContext = createContext(null)

const SessionProvider = ({ children }) => {
  const [isSignedIn, setSignedIn] = useState(false)

  useEffect(() => {
    if (Cookies.get('token')) {
      setSignedIn(true)
    } else {
      setSignedIn(false)
    }
  }, [])

  const signin = (accessToken) => {
    setSignedIn(true)
    document.cookie = `token=${accessToken}; path=/;`
  }

  const signout = () => {
    setSignedIn(false)
    localStorage.clear()
    Cookies.remove('token')
    Cookies.remove('session')
    Cookies.remove('session.sig')
  }

  const sessionContextValue = {
    isSignedIn,
    signin,
    signout
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
