import React from 'react'
import ReactDOM from 'react-dom/client'
import './assets/index.scss'
import Homepage from './pages/Home/Homepage'
import Sites from './pages/Sites/Sites'
import Analytics from './pages/Analytics/Analytics'
import History from './pages/History/History'
import Navigation from './components/ui/navbar'
import Login from './pages/Auth/Login'
import { Routes, Route, BrowserRouter } from 'react-router-dom'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <BrowserRouter>
    <Navigation/>
      <Routes>
        <Route exact path="/" element={<Homepage />}/>
        <Route exact path='/sites' element={<Sites />}/>
        <Route exact path='/analytics' element={<Analytics />}/>
        <Route exact path='/history' element={<History />}/>
        <Route exact path='/login' element={<Login />}/>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
