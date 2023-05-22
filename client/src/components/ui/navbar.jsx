import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Cookies from 'js-cookie'
import Login from '../form/Login'
import '../../assets/Navbar.scss'

function Navigation () {
  const [toggled, setToggled] = useState(false)
  const [mobileMode, setMobileMode] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [session, setSession] = useState(Cookies.get('token'))
  const [isActive, setIsActive] = useState(false)

  React.useEffect(() => {
    const handleDocumentClick = (event) => {
      const loginFormOverlay = document.querySelector('.login-form-overlay')
      const loginButton = document.querySelector('.login-container button')
      if ((loginFormOverlay && !loginFormOverlay.contains(event.target)) && (loginButton && !loginButton.contains(event.target))) {
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
    await fetch('/api/auth/signout', {
      method: 'POST',
      credentials: 'include'
    })
    localStorage.clear()
    Cookies.remove('token')
    Cookies.remove('session')
    Cookies.remove('session.sig')
    window.location.href = '/'
  }

  const closeMenu = () => {
    setToggled(false)
  }

  const handleLoginSuccess = (session) => {
    setIsActive(false)
    setSession(session)
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

  const handleTransitionEnd = () => {
    if (!isActive && showLogin) {
      setShowLogin(false)
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
            <div className="nav-container">
                <div className="logo">BDO Grind Tracker</div>
                <div className="navbar-section">
                    <ul>
                        <li className="home">
                            <Link to="/" aria-label="home-link">Home</Link>
                        </li>
                        <li className="sites">
                            <Link to="/sites"aria-label="sites-link">Sites</ Link>
                        </li>
                        <li className="history">
                            <Link to="/history"aria-label="history-link">History</Link>
                        </li>
                        <li className="analytics">
                            <Link to="/analytics"aria-label="analytics-link">Analytics</Link>
                        </li>
                    </ul>
                </div>
            </div>
            {session
              ? <div className='account-control'>
                        <div className="Logout">
                            <button aria-label="logout-button" onClick={logout}>Logout</button>
                        </div>
                    </div>
              : (<div className="login-container">
                            <button aria-label="login-link" onClick={() => { handleLoginClick() }}>Login</button>
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
                    <li className="sites">
                        <Link to="/sites" aria-label="sites-hamburger-link" onClick={() => closeMenu()}>Sites</ Link>
                    </li>
                    <li className="history">
                        <Link to="/history" aria-label="history-hamburger-link" onClick={() => closeMenu()} >History</Link>
                    </li>
                    <li className="analytics">
                        <Link to="/analytics" aria-label="analytics-hamburger-link" onClick={() => closeMenu()} >Analytics</Link>
                    </li>
                    {session
                      ? (
                          <div className="Logout">
                            <button aria-label="logout-hamburger-link" onClick={logout}>Logout</button>
                        </div>
                        )
                      : (
                        <div className="Login">
                            <button aria-label="login-hamburger-link" onClick={() => { closeMenu(); handleLoginClick() }}>Login</button>
                        </div>
                        )
                    }
                </ul>
            </>
        )}
    </nav>
</>
  )
}
export default Navigation
