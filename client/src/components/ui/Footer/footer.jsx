import React from 'react'
import { Link } from 'react-router-dom'
import '../../../assets/components/Footer/footer.scss'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <nav className="footer-nav">
          <ul className="footer-nav-list">
            <li><Link to="/privacy" className="footer-nav-list-item">Privacy Policy</Link></li>
            <li><Link to="/terms-of-service" className="footer-nav-list-item">Terms of Service</Link></li>
            <li><Link to="/contact" className="footer-nav-list-item">Contact</Link></li>
          </ul>
        </nav>
        <p className="footer-text">© 2023 Martin Flasar. All rights reserved. </p>
      </div>
    </footer>
  )
}

export default Footer
