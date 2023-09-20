import React, { useEffect, useContext, useReducer } from 'react'
import { createPortal } from 'react-dom'
import { Link, useNavigate } from 'react-router-dom'
import Login from '../../form/Login/Login'
import Signup from '../../form/Signup/Signup'
import '../../../assets/components/ui/Navbar.scss'
import { SessionContext } from '../../../contexts/SessionContext'
import { INITIAL_STATE, navbarReducer } from './navbarReducer'

// TODO:
// - SCSS for Signup component for mobile device ( broken )
// - Most likely I can make this more organized

// This can be in different file
const Portal = ({ el }) => {
  const mount = document.getElementById('portal-root')

  return createPortal(el, mount)
}

function Navigation () {
  const { isSignedIn, signout, authorizedFetch, userData } = useContext(SessionContext)
  const navigate = useNavigate()
  const [state, dispatch] = useReducer(navbarReducer, INITIAL_STATE)
  const isClickOutsideElements = (event) => {
    const clickTarget = event.target
    const loginFormOverlay = document.querySelector('.login-container-form')
    const loginButton = document.querySelector('.login-container button')
    const signupFormContainer = document.querySelector('.signup-form-container')
    const signupButton = document.querySelector('.signup-container button')
    const profileIcon = document.querySelector('.ProfileIcon')

    return (
      ((loginFormOverlay && !loginFormOverlay.contains(clickTarget)) &&
        (loginButton && !loginButton.contains(clickTarget))) ||
      ((signupFormContainer && !signupFormContainer.contains(clickTarget)) &&
        (signupButton && !signupButton.contains(clickTarget))) || (profileIcon && !profileIcon.contains(clickTarget))
    )
  }
  const handleDocumentClick = (event) => {
    if (isClickOutsideElements(event)) {
      if (state.overlayActive) {
        dispatch({ type: 'TOGGLE_OVERLAY', payload: false })
        document.body.removeAttribute('style')
      } else if (state.profileIconMenu) {
        dispatch({ type: 'TOGGLE_PROFILE_ICON_MENU', payload: false })
      }
    }
  }
  useEffect(() => {
    document.addEventListener('click', handleDocumentClick)

    return () => {
      document.removeEventListener('click', handleDocumentClick)
    }
  }, [state])

  useEffect(() => {
    if (isSignedIn && userData) {
      dispatch({ type: 'PROFILE_ICON_UPDATE', payload: userData.ImageUrl })
    }
  }, [isSignedIn])

  useEffect(() => {
    const checkScreenWidth = () => {
      const isMobileMode = window.innerWidth <= 768
      dispatch({ type: 'MOBILE_MODE_UPDATE', payload: isMobileMode })
    }
    checkScreenWidth()
    window.addEventListener('resize', checkScreenWidth)

    return () => {
      window.removeEventListener('resize', checkScreenWidth)
    }
  }, [])

  useEffect(() => {
    dispatch({ type: 'ACTIVE_LINK_UPDATE', payload: location.pathname })
  }, [location.pathname])

  const logout = async () => {
    const res = await authorizedFetch('/api/auth/signout', {
      method: 'POST',
      credentials: 'include'
    })
    const data = await res.json()

    if (data.message === 'Successfully signed out!') {
      signout()
      navigate('/')
    }
  }

  const profile = () => {
    dispatch({ type: 'TOGGLE_PROFILE_ICON_MENU', payload: false })
    navigate('/profile')
  }

  const closeMenu = () => {
    dispatch({ type: 'TOGGLE_MOBILE_MENU', payload: false })
  }

  const handleLoginSuccess = () => {
    dispatch({ type: 'SIGNIN_OVERLAY_HIDE' })
    if (userData) {
      dispatch({ type: 'PROFILE_ICON_UPDATE', payload: userData.ImageUrl })
    }
    window.location.reload()
  }

  const handleSignupSuccess = () => {
    dispatch({ type: 'SIGNUP_SUCCESS', payload: '../assets/defaultProfileIcon.jpg' }) // showSignup false
    window.location.reload()
  }

  const handleProfileIconMenu = () => {
    dispatch({ type: 'TOGGLE_PROFILE_ICON_MENU', payload: !state.profileIconMenu })
  }

  const handleLoginClick = () => {
    if (!state.showSignin) {
      if (state.showSignup) {
        dispatch({ type: 'TOGGLE_OVERLAY', payload: false })
        dispatch({ type: 'SIGNUP_OVERLAY_HIDE' })
      }
      dispatch({ type: 'SIGNIN_OVERLAY_SHOW' })
      setTimeout(() => {
        dispatch({ type: 'TOGGLE_OVERLAY', payload: true })
      }, 0)
    } else {
      dispatch({ type: 'TOGGLE_OVERLAY', payload: false })
      setTimeout(() => {
        dispatch({ type: 'SIGNIN_OVERLAY_HIDE' })
      }, 300)
    }
  }

  const handleSignupClick = () => {
    if (!state.showSignup) {
      if (state.showSignin) {
        dispatch({ type: 'TOGGLE_OVERLAY', payload: false })
        dispatch({ type: 'SIGNIN_OVERLAY_HIDE' })
      }
      dispatch({ type: 'SIGNUP_OVERLAY_SHOW' })
      setTimeout(() => {
        dispatch({ type: 'TOGGLE_OVERLAY', payload: true })
        document.body.style.overflow = 'hidden'
      }, 0)
    } else {
      dispatch({ type: 'TOGGLE_OVERLAY', payload: false })
      document.body.removeAttribute('style')
      setTimeout(() => {
        dispatch({ type: 'SIGNUP_OVERLAY_HIDE' })
      }, 300)
    }
  }

  const handleTransitionEnd = () => {
    if (!state.overlayActive && state.showSignin) {
      dispatch({ type: 'SIGNIN_OVERLAY_HIDE' })
    } else if (!state.overlayActive && state.showSignup) {
      dispatch({ type: 'SIGNUP_OVERLAY_HIDE' })
    }
  }

  // Transfer this into profile
  /*   const handleTestButtonFire = async () => {
    await authorizedFetch('/api/user/uploadprofilepicture', { method: 'POST' }).then(res => res.json()).then(data => {
      console.log(data)
    })

    <li className='TestBtn'>
      <button aria-label="TestBtn" onClick={handleTestButtonFire}>Test</button>
    </li>
  } */

  return (
    <>
        {state.showSignin && <Portal el={(
        <div className={`login-form-overlay ${state.overlayActive ? 'active' : ''}`}
      onTransitionEnd={handleTransitionEnd}>
             <Login onLoginSuccess={handleLoginSuccess} onClose={() => { dispatch({ type: 'SIGNIN_OVERLAY_HIDE', payload: false }) } }/>
        </div>
        )}/>}
        {state.showSignup && <Portal el={<div className={`signup-form-overlay ${state.overlayActive ? 'active' : ''}`} onTransitionEnd={handleTransitionEnd}>
            <Signup onSignupSuccess={handleSignupSuccess} onClose={() => { dispatch({ type: 'SIGNUP_OVERLAY_HIDE', payload: false }) } }/>
          </div>}/>}
    <div className="nav-container">
      <nav>
          {state.mobileMode && (
              <div className="container">
                  <button aria-label="Toggle menu" className={state.toggleMobileMenu ? 'hamburger close' : 'hamburger'} onClick={() => { dispatch({ type: 'TOGGLE_MOBILE_MENU', payload: !state.toggleMobileMenu }) }}>
                      <span className="meat"></span>
                      <span className="meat"></span>
                      <span className="meat"></span>
                      <span className="meat"></span>
                  </button>
              </div>
          )}
          {!state.mobileMode && (
              <>
                  <div className="logo">BDO Grind Tracker</div>
                  <div className="navbar-section">
                      <ul>
                          <li className="home-link">
                              <Link to="/" className={state.activeLink === '/' ? 'active' : ''} aria-label="home-link">Home</Link>
                          </li>
                          {isSignedIn && (
                          <ul>
                            <li className="sites-link">
                                <Link to="/sites" className={state.activeLink === '/sites' ? 'active' : ''} aria-label="sites-link">Sites</ Link>
                            </li>
                            <li className="history-link">
                                <Link to="/history" className={state.activeLink === '/history' ? 'active' : ''} aria-label="history-link">History</ Link>
                            </li>
                            <li className='marketplace-link'>
                              <Link to="/marketplace" className={state.activeLink === '/marketplace' ? 'active' : ''} aria-label='marketplace-link'>Marketplace</Link>
                            </li>
                          </ul>
                          )}
                      </ul>
                  </div>
              {isSignedIn
                ? <div className='account-control'>
                    <div className='ProfileIcon'>
                        <img src={state.profileIcon}
                            className="profile-icon" alt='Profile Icon'
                            onClick={handleProfileIconMenu}
                            />
                    </div>
                    {state.profileIconMenu && (
                      <div className='ProfileIconMenu'>
                          <>
                          <div className='Profile'>
                            <button aria-label='profile-button' onClick={profile}>Profile</button>
                          </div>
                          <div className="Logout">
                              <button aria-label="logout-button" onClick= {logout}>Logout</button>
                          </div>
                          </>
                      </div>
                    )}
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
          {state.mobileMode && (
              <>
                  <div className="logo">BDO Grind Tracker</div>
                  <ul role='menu' className={['menu', state.toggleMobileMenu && 'active'].filter(Boolean).join(' ')}>
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
