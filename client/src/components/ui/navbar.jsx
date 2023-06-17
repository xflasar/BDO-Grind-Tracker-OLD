import React, { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import Login from '../form/Login'
import Signup from '../form/Signup'
import '../../assets/components/ui/Navbar.scss'
import { SessionContext } from '../../contexts/SessionContext'

// TODO:
// - SCSS for Signup component for mobile device ( broken )
// - Signup component close

function Navigation () {
  const [toggled, setToggled] = useState(false)
  const [mobileMode, setMobileMode] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [showSignup, setShowSignup] = useState(false)
  const [isActive, setIsActive] = useState(false)
  const { isSignedIn, signout, authorizedFetch } = useContext(SessionContext)

  useEffect(() => {
    const handleDocumentClick = (event) => {
      const loginFormOverlay = document.querySelector('.login-form-overlay')
      const loginButton = document.querySelector('.login-container button')
      const signupFormOverlay = document.querySelector('.signup-form-overlay')
      const signupButton = document.querySelector('.signup-container button')
      if (((loginFormOverlay && !loginFormOverlay.contains(event.target)) && (loginButton && !loginButton.contains(event.target))) || ((signupFormOverlay && !signupFormOverlay.contains(event.target)) && (signupButton && !signupButton.contains(event.target)))) {
        setIsActive(false)
      }
    }

    document.addEventListener('click', handleDocumentClick)

    const checkScreenWidth = () => {
      const isMobileMode = window.innerWidth <= 768
      setMobileMode(isMobileMode)
    }
    checkScreenWidth()
    window.addEventListener('resize', checkScreenWidth)

    return () => {
      window.removeEventListener('resize', checkScreenWidth)
      document.removeEventListener('click', handleDocumentClick)
    }
  }, [])

  const logout = async () => {
    const res = await authorizedFetch('/api/auth/signout', {
      method: 'POST',
      credentials: 'include'
    })
    const data = await res.json()

    if (data.message === 'Successfully signed out!') {
      signout()
      window.location.href = '/'
    }
  }

  const closeMenu = () => {
    setToggled(false)
  }

  const handleLoginSuccess = () => {
    setIsActive(false)
    window.location.reload()
  }

  const handleSignupSuccess = () => {
    setIsActive(false)
    window.location.reload()
  }

  const handleLoginClick = () => {
    if (!showLogin) {
      setShowLogin(true)
      setTimeout(() => {
        setIsActive(true)
      }, 0)
    } else {
      setIsActive(false)
      setTimeout(() => {
        setShowLogin(false)
      }, 300)
    }
  }

  const handleSignupClick = () => {
    if (!showSignup) {
      setShowSignup(true)
      setTimeout(() => {
        setIsActive(true)
      }, 0)
    } else {
      setIsActive(false)
      setTimeout(() => {
        setShowSignup(false)
      }, 300)
    }
  }

  const handleTransitionEnd = () => {
    if (!isActive && showLogin) {
      setShowLogin(false)
    } else if (!isActive && showSignup) {
      setShowSignup(false)
    }
  }

  return (
    <>
        {showLogin && (
        <div className={`login-form-overlay ${isActive ? 'active' : ''}`}
      onTransitionEnd={handleTransitionEnd}>
             <Login onLoginSuccess={handleLoginSuccess} onClose={() => { setShowLogin(false) } }/>
        </div>
        )}
        {showSignup && (
          <div className={`signup-form-overlay ${isActive ? 'active' : ''}`} onTransitionEnd={handleTransitionEnd}>
            <Signup onSignupSuccess={handleSignupSuccess} onClose={() => { setShowSignup(false) } }/>
          </div>
        )}
    <div className="nav-container">
      <nav>
          {mobileMode && (
              <div className="container">
                  <button aria-label="Toggle menu" className={toggled ? 'hamburger close' : 'hamburger'} onClick={() => { setToggled(!toggled); setShowLogin(false) }}>
                      <span className="meat"></span>
                      <span className="meat"></span>
                      <span className="meat"></span>
                      <span className="meat"></span>
                  </button>
              </div>
          )}
          {!mobileMode && (
              <>

                  <div className="logo">BDO Grind Tracker</div>
                  <div className="navbar-section">
                      <ul>
                          <li className="home">
                              <Link to="/"aria-label="home-link">Home</Link>
                          </li>
                          {isSignedIn && (
                          <ul>
                          <li className="sites">
                              <Link to="/sites"aria-label="sites-link">Sites</ Link>
                          </li>
                          <li className="history">
                              <Link to="/history"aria-label="history-link">History</ Link>
                          </li>
                          <li className="analytics">
                              <Link to="/analytics"aria-label="analytics-link">Analytics  </Link>
                          </li>
                          </ul>
                          )}
                      </ul>
                  </div>
              {isSignedIn
                ? <div className='account-control'>
                          <div className="Logout">
                              <button aria-label="logout-button" onClick= {logout}>Logout</button>
                          </div>
                      </div>
                : (
                  <div className="account-control">
                <div className="login-container">
                    <button aria-label="login-link" onClick={() => { handleLoginClick() }}>Login</button>
                </div>
                <div className="signup-container">
                  <button aria-label="signup-button" onClick={() => { handleSignupClick() }}>Signup</button>
                </div>
                </div>
                  )
              }
              </>)}
          {mobileMode && (
              <>
                  <div className="logo">BDO Grind Tracker</div>
                  <ul role='menu' className={['menu', toggled && 'active'].filter(Boolean).join(' ')}>
                      <li className="home">
                          <Link to="/" aria-label="home-hamburger-link" onClick={() => closeMenu()}>Home</Link>
                      </li>
                      {isSignedIn && (
                      <>
                      <li className="sites">
                          <Link to="/sites" aria-label="sites-hamburger-link" onClick={() => closeMenu()}>Sites</ Link>
                      </li>
                      <li className="history">
                          <Link to="/history" aria-label="history-hamburger-link" onClick={() => closeMenu()} >History</Link>
                      </li>
                      <li className="analytics">
                          <Link to="/analytics" aria-label="analytics-hamburger-link" onClick={() => closeMenu()} >Analytics</Link>
                      </li>
                      </>
                      )}
                      {isSignedIn
                        ? (
                            <div className="Logout">
                              <button aria-label="logout-hamburger-link" onClick={logout}>Logout</button>
                          </div>
                          )
                        : (
                          <>
                          <div className="Login">
                              <button aria-label="login-hamburger-button" onClick={() => { closeMenu(); handleLoginClick() }}>Login</button>
                          </div>
                          <div className="Register">
                            <button aria-label="register-hamburger-button" onClick={() => { closeMenu(); handleSignupClick() }}>Register</button>
                          </div>
                          </>
                          )
                      }
                  </ul>
              </>
          )}
      </nav>
    </div>
</>
  )
}
export default Navigation
