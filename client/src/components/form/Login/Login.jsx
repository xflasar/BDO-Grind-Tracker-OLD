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
  }

  const handlePasswordChange = (event) => {
    dispatch({ type: 'LOGIN_INPUT_UPDATE', payload: { name: event.target.name, value: event.target.value } })
  }

  const validateLoginData = (type, data) => {
    switch (type) {
      case 'username':
        if (data.length < 1) {
          dispatch({ type: 'LOGIN_INPUT_ERROR', payload: { name: 'username', msg: 'Username is required.' } })
          return false
        }
        return true
      case 'password':
        if (data.length < 1) {
          dispatch({ type: 'LOGIN_INPUT_ERROR', payload: { name: 'password', msg: 'Password is required.' } })
          return false
        }
        return true
      default:
        break
    }
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    const username = validateLoginData('username', state.username) ? state.username : false
    const password = validateLoginData('password', state.password) ? state.password : false

    if (!username || !password) return

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
      if (response.ok) {
        const res = await response.json()
        if (res.userData) {
          setSessionUserData(res.userData)
        }
        signin()
        dispatch('LOGIN_SUCCESS')
        onLoginSuccess() // Think if we want to make the page refreshed or just update the session state
      } else {
        const res = await response.json()
        if (res.message === 'User not found.') {
          dispatch({ type: 'LOGIN_INPUT_ERROR', payload: { name: 'username', msg: res.message } })
        } else if (res.message === 'Invalid Password!') {
          dispatch({ type: 'LOGIN_FAIL_PASSWORD', payload: { msg: res.message } })
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
  return (
    <div name='login-container' className='login-container-form'>
      <form aria-label='login-container-form' onSubmit={handleLogin}>
        <h3>Login</h3>
        <div className='login-form-inputs'>
          <input type='text' aria-label='username' className={state.usernameError ? 'username error' : 'username'} name='username' value={state.username} onChange={handleUsernameChange} placeholder='Username or Email'/>
          {state.usernameError
            ? (
              <label htmlFor='username' style={{ color: 'red' }}>
                {state.usernameErrorMsg}
              </label>
              )
            : (<></>)
            }
          <input type='password' aria-label='password' className={state.passwordError ? 'password error' : 'password'} name='password' value={state.password} onChange={handlePasswordChange} placeholder='Password'/>
          {state.passwordError
            ? (
              <label htmlFor='password' style={{ color: 'red' }}>
                {state.passwordErrorMsg}
              </label>
              )
            : (<></>)
            }
        </div>
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
