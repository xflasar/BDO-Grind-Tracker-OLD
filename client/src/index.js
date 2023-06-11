import React, { useContext } from 'react'
import ReactDOM from 'react-dom/client'
import './assets/pages/index.scss'
import Homepage from './pages/Home/Homepage'
import Sites from './pages/Sites/Sites'
import Analytics from './pages/Analytics/Analytics'
import History from './pages/History/History'
import Navigation from './components/ui/navbar'
import Profile from './pages/UserControlPanel/Profile'
import NotFound from './pages/Error/NotFound.jsx'
import AccessDenied from './pages/Error/AccessDenied'
import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom'
import { SessionContext, SessionProvider } from './contexts/SessionContext'
import PropTypes from 'prop-types'

const App = () => {
  const ProtectedRoute = ({ element }) => {
    const { isSignedIn } = useContext(SessionContext)
    if (isSignedIn) {
      return element
    } else {
      return <Navigate to="/access-denied" />
    }
  }

  return (
    <BrowserRouter>
    <Navigation/>
    <Routes>
      <Route exact path="/" element={<Homepage />} />
      <Route exact path='/sites' element={<ProtectedRoute element={<Sites />} />} />
      <Route exact path='/analytics' element={<ProtectedRoute element={<Analytics />} />} />
      <Route exact path='/history' element={<ProtectedRoute element={<History />} />} />
      <Route exact path='/profile' element={<ProtectedRoute element={<Profile />} />} />
      <Route exact path='/access-denied' element={<AccessDenied/>} />
      <Route path='*' element={<NotFound/>} />
    </Routes>
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
