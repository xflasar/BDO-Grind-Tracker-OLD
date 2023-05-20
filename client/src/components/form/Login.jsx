import React, { useState } from 'react'
import PropTypes from 'prop-types'
import '../../assets/Login/Login.scss'

const Login = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleUsernameChange = (event) => {
    setUsername(event.target.value)
  }

  const handlePasswordChange = (event) => {
    setPassword(event.target.value)
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username,
          password
        })
      })
      const res = await response.json()
      document.cookie = `token=${res.accessToken}; path=/;`
      onLoginSuccess(res.accessToken)
      setUsername('')
      setPassword('')
    } catch (error) {
      console.error(error)
    }
  }

  // Implement this to send a password reset email??
  /* const handleForgotPassword = (event) => {
    event.preventDefault()
  } */
  // Email is not yet implemented in the backend, so this is not yet implemented in the frontend
  return (
    <div className='login-container-form'>
        <h3>Login</h3>
      <form onSubmit={handleLogin}>
        <input type="text" id="username" name="username" value={username} onChange={handleUsernameChange} placeholder='Username or Email'/>
        <input type="password" id="password" name="password" value={password} onChange={handlePasswordChange} placeholder='Password'/>
        <button type="submit">Login</button>
      </form>
      { /* <a href="#" onClick={handleForgotPassword}>Forgot password?</a> */ }
    </div>
  )
}

Login.propTypes = {
  onLoginSuccess: PropTypes.func.isRequired
}

export default Login
