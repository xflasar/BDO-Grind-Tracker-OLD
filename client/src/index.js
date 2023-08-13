import React, { useContext } from 'react'
import ReactDOM from 'react-dom/client'
import './assets/pages/index.scss'
import Homepage from './pages/Home/Homepage'
import Sites from './pages/Sites/Sites'
import Analytics from './pages/Analytics/Analytics'
import History from './pages/History/History'
import Navigation from './components/ui/navbar/navbar'
import Profile from './pages/UserControlPanel/Profile'
import Marketplace from './pages/Marketplace/Marketplace'
import NotFound from './pages/Error/NotFound'
import AccessDenied from './pages/Error/AccessDenied'
import Footer from './components/ui/Footer/footer'
import PrivacyPolicy from './pages/PrivacyPolicy/PrivacyPolicy'
import TermsOfService from './pages/TermsOfService/TermsOfService'
import Contact from './pages/Contact/Contact'
import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom'
import { SessionContext, SessionProvider } from './contexts/SessionContext'
import PropTypes from 'prop-types'

const App = () => {
  const { isSignedIn } = useContext(SessionContext)

  const ProtectedRoute = ({ element }) => {
    if (isSignedIn) {
      return element
    } else {
      return <Navigate to="/access-denied" />
    }
  }

  return (
    <BrowserRouter>
      <header>
        <Navigation/>
      </header>
      <main>
        <Routes>
          <Route exact path="/" element={<Homepage />} />
          <Route exact path='/sites' element={<ProtectedRoute element={<Sites />} />} />
          <Route exact path='/analytics' element={<ProtectedRoute element={<Analytics />} />} />
          <Route exact path='/history' element={<ProtectedRoute element={<History />} />} />
          <Route exact path='/profile' element={<ProtectedRoute element={<Profile />} />} />
          <Route exact path='/marketplace' element={<ProtectedRoute element={<Marketplace />} />} />
          <Route exact path='/privacy' element={<PrivacyPolicy/>} />
          <Route exact path='/terms-of-service' element={<TermsOfService/>} />
          <Route exact path='/contact' element={<Contact/>} />
          <Route exact path='/access-denied' element={<AccessDenied/>} />
          <Route path='*' element={<NotFound/>} />
        </Routes>
      </main>
      <Footer/>
    </BrowserRouter>
  )
}

App.propTypes = {
  element: PropTypes.any
}

const container = document.getElementById('root')
const root = ReactDOM.createRoot(container)
root.render(
<React.StrictMode>
  <SessionProvider>
    <App />
  </SessionProvider>
</React.StrictMode>
)
