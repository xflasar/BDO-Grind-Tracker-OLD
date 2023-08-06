import React from 'react'
import '../../../assets/components/Footer/footer.scss'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <nav className="footer-nav">
          <ul className="footer-nav-list">
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms of Service</a></li>
            <li><a href="#">Contact</a></li>
          </ul>
        </nav>
        <p className="footer-text">© 2023 Martin Flasar. All rights reserved. </p>
      </div>
    </footer>
  )
}

export default Footer
