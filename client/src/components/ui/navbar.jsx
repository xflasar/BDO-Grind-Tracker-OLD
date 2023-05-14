///
// Navbar component
//
// - Home - Will transfer to Homepage
// - Sites - Will transfer to page with Sites
// - Appname - Name of the application (default -> BDO Grind Tracker)
// - History - Will transfer to History page
// - Analytics - Will transfer to Analytics page
//
// Will be used as Header for application on every page will be the same.
// For now it won't be using any backend due to being only a navigation between pages.
//
///

import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Cookies from 'js-cookie'
import '../../assets/Navbar.scss'

function Navigation () {
  const [toggled, setToggled] = useState(false)
  const [mobileMode, setMobileMode] = useState(false)
  const session = Cookies.get('token')

  React.useEffect(() => {
    const checkScreenWidth = () => {
      const isMobileMode = window.innerWidth <= 768
      setMobileMode(isMobileMode)
    }
    checkScreenWidth()
    window.addEventListener('resize', checkScreenWidth)
    return () => window.removeEventListener('resize', checkScreenWidth)
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

  return (
    <nav>
        {mobileMode && (
        <div className="container">
            <button aria-label="Toggle menu" className={toggled ? 'hamburger close' : 'hamburger'} onClick={() => setToggled(!toggled)}>
                <span className="meat"></span>
                <span className="meat"></span>
                <span className="meat"></span>
                <span className="meat"></span>
            </button>
        </div>
        )}
        <div className="logo"> BDO Grind Tracker </div>

        {!mobileMode && (
            <div className="navbar-section">
                <ul>
                    <div className="navbar-left">
                        <div>
                            <li className="home">
                                <Link to="/" aria-label="home-link">Home</Link>
                            </li>
                        </div>
                        <li className="sites">
                            <Link to="/sites" aria-label="sites-link">Sites</ Link>
                        </li>
                    </div>
                    <div className="navbar-right">
                        <li className="history">
                            <Link to="/history" aria-label="history-link">History</Link>
                        </li>
                        <li className="analytics">
                            <Link to="/analytics" aria-label="analytics-link">Analytics</Link>
                        </li>
                    </div>
                    {session
                      ? <div className="Logout">
                        <li className="logout">
                            <Link to="/" aria-label="logout-link" onClick={logout}>Logout</Link>
                        </li>
                    </div>
                      : <div className="login-container">
                        <li className="login">
                            <Link to="/login" aria-label="login-link">Login</Link>
                        </li>
                    </div>}
                </ul>
            </div>)}
        {mobileMode && (
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
        </ul>
        )}
    </nav>
  )
}
export default Navigation
