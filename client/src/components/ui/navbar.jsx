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

import React, { useState} from 'react';
import { Link } from 'react-router-dom';
import '../../assets/Navbar.scss';

function Navigation () {
    const [toggled, setToggled] = useState(false)
    const [desktopMode, setDesktopMode] = useState(true)

    const screenSizes = {
        small: 800
    }

    window.addEventListener('resize', () => {
        if (window.innerWidth > screenSizes.small) {
            setDesktopMode(true)
        } else {
            setDesktopMode(false)
        }
    })

    const closeMenu = () => {
        setToggled(false)
    }

    return (
    <nav>
        <div className="container">
            <div className={toggled ? 'hamburger close' : 'hamburger'} onClick={() => setToggled(!toggled)}>
                <span className="meat"></span>
                <span className="meat"></span>
                <span className="meat"></span>
                <span className="meat"></span>
            </div>
        </div>
        <div className="logo"> BDO Grind Tracker </div>
        
        {desktopMode && (
            <div className="navbar-section">
                <ul>
                    <div className="navbar-left">
                        <li className="home">
                            <Link to="/">Home</ Link>
                        </li>
                        <li className="sites">
                            <Link to="/sites">Sites</   Link>
                        </li>
                    </div>
                    <div className="navbar-right">
                        <li className="history">
                            <Link to="/history">History</Link>
                        </li>
                        <li className="analytics">
                            <Link to="/analytics">Analytics</Link>
                        </li>
                    </div>
                </ul>
            </div>)}
        
        <ul className={[ 'menu', toggled && 'active' ].filter(Boolean).join(' ')}>
            <li className="home">
                <Link to="/" onClick={() => closeMenu()}>Home</Link>
            </li>
            <li className="sites">
                <Link to="/sites" onClick={() => closeMenu()}>Sites</   Link>
            </li>
            <li className="history">
                <Link to="/history" onClick={() => closeMenu()} >History</Link>
            </li>
            <li className="analytics">
                <Link to="/analytics" onClick={() => closeMenu()}   >Analytics</Link>
            </li>
        </ul>
    </nav>
    )
}
  export default Navigation;