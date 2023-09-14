import React, { createContext } from 'react'
import PropTypes from 'prop-types'
const Auth = require('./SessionContext.helper')

const SessionContext = createContext()

const SessionProvider = ({ children }) => {
  const { isSignedIn, signin, signout, userData, setUserData } = Auth.useAuthentication()

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

  const handleUnauthorized = () => signout()

  const sessionContextValue = {
    isSignedIn,
    userData,
    signin,
    signout,
    authorizedFetch,
    setSessionUserData: setUserData
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
