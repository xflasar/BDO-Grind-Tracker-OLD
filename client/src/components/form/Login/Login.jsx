import React, { useReducer, useContext } from 'react'
import PropTypes from 'prop-types'
import '../../../assets/components/ui/Login/Login.scss'
import { SessionContext } from '../../../contexts/SessionContext'
import { INITIAL_STATE, loginReducer } from './loginReducer'

const Login = ({ onLoginSuccess }) => {
  const { signin, authorizedFetch, setSessionUserData } = useContext(SessionContext)
  const [state, dispatch] = useReducer(loginReducer, INITIAL_STATE)

  const handleUsernameChange = (event) => {
    dispatch({ type: 'LOGIN_INPUT_UPDATE', payload: { name: event.target.name, value: event.target.value } })
    console.log(state.username)
  }

  const handlePasswordChange = (event) => {
    dispatch({ type: 'LOGIN_INPUT_UPDATE', payload: { name: event.target.name, value: event.target.value } })
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    const username = state.username
    const password = state.password
    console.log(state)
    try {
      const response = await authorizedFetch('api/auth/signin', {
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
        if (res.userData) {
          setSessionUserData(res.userData)
        }
        signin(res.accessToken)
        dispatch('LOGIN_SUCCESS')
        onLoginSuccess() // Think if we want to make the page refreshed or just update the session state
      } else {
        if (res.message === 'User not found.') {
          dispatch({ type: 'LOGIN_FAIL_USERNAME' })
          console.log(state.usernameError)
        } else if (res.message === 'Invalid Password!') {
          dispatch({ type: 'LOGIN_FAIL_PASSWORD' })
          console.log(state.passwordError)
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
    <div name='login-container' className='login-container-form'>
      <form aria-label='login-container-form' onSubmit={handleLogin}>
        <h3>Login</h3>
        {!state.usernameError
          ? <input type='text' aria-label='username' className='username' name='username' value={state.username} onChange={handleUsernameChange} placeholder='Username or Email'/>
          : <input type='text' aria-label='username' className='username error' name='username' value={state.username} onChange={handleUsernameChange} placeholder='Username'/>
        }
        {!state.passwordError
          ? <input type='password' aria-label='password' className='password' name='password' value={state.password} onChange={handlePasswordChange} placeholder='Password'/>
          : <input type='password'aria-label='password' className='password error' name='password' value={state.password} onChange={handlePasswordChange} placeholder='Password'/>}
        {state.usernameError
          ? <p className='error'>Username not found.</p>
          : null}
        {state.passwordError
          ? <p className='error'>Invalid Password!</p>
          : null}
        <button type='submit' aria-label='loginButton'>Login</button>
      </form>
      { /* <a href="#" onClick={handleForgotPassword}>Forgot password?</a> */ }
    </div>
  )
}

Login.propTypes = {
  onLoginSuccess: PropTypes.func.isRequired
}

export default Login
