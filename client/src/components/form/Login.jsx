import React, { useState } from 'react'
import PropTypes from 'prop-types'
import '../../assets/Login/Login.scss'

const Login = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [usernameError, setUsernameError] = useState(false)
  const [passwordError, setPasswordError] = useState(false)

  const handleUsernameChange = (event) => {
    setUsername(event.target.value)
    setUsernameError(false)
  }

  const handlePasswordChange = (event) => {
    setPassword(event.target.value)
    setPasswordError(false)
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const response = await fetch('api/auth/signin', {
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
      if (res.accessToken) {
        document.cookie = `token=${res.accessToken}; path=/;`
        onLoginSuccess(res.accessToken)
        setUsername('')
        setPassword('')
      } else {
        if (res.message === 'User not found.') {
          setUsernameError(true)
          setUsername('')
          setPassword('')
        } else if (res.message === 'Invalid Password!') {
          setPasswordError(true)
          setUsername('')
          setPassword('')
        }
      }
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
        {!usernameError ? <input type="text" className='username' name="username" value={username} onChange={handleUsernameChange} placeholder='Username or Email'/> : <input type="text" className='username error' name="username" value={username} onChange={handleUsernameChange} placeholder='Username'/>}
        {!passwordError ? <input type="password" className='password' name="password" value={password} onChange={handlePasswordChange} placeholder='Password'/> : <input type="password" className='password error' name="password" value={password} onChange={handlePasswordChange} placeholder='Password'/>}
        {usernameError ? <p className='error'>Username or Email not found.</p> : null}
        {passwordError ? <p className='error'>Invalid Password!</p> : null}
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
