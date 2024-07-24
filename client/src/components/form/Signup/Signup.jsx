import React, { useContext, useEffect, useReducer } from 'react'
import PropTypes from 'prop-types'
import '../../../assets//components/ui/Signup/Signup.scss'
import { SessionContext } from '../../../contexts/SessionContext'
import { INITIAL_STATE, signupReducer } from './signupReducer'

const Signup = ({ onSignupSuccess, onClose }) => {
  const { authorizedFetch, signin } = useContext(SessionContext)
  const [state, dispatch] = useReducer(signupReducer, INITIAL_STATE)

  const handleUsernameChange = (e) => {
    dispatch({ type: 'SIGNUP_INPUT_CHANGE', payload: { name: e.target.name, value: e.target.value } })
  }

  const handleEmailChange = (e) => {
    dispatch({ type: 'SIGNUP_INPUT_CHANGE', payload: { name: e.target.name, value: e.target.value } })
  }

  const handlePasswordChange = (e) => {
    dispatch({ type: 'SIGNUP_INPUT_CHANGE', payload: { name: e.target.name, value: e.target.value } })
  }

  const checkValidationOfData = (type, data) => {
    switch (type) {
      case 'username':
        if (data.length < 3 || data.length > 20) {
          dispatch({ type: 'SIGNUP_USERNAME_ERROR', payload: { msg: 'Username must be between 3 and 20 characters' } })
          return false
        }
        return true
      case 'email':
        if (!data.toString().includes('@')) {
          dispatch({ type: 'SIGNUP_EMAIL_ERROR', payload: { msg: 'Email not in correct format.' } })
          return false
        }
        return true
      case 'password':
        if (data.length < 8) {
          dispatch({ type: 'SIGNUP_PASSWORD_ERROR', payload: { msg: 'Password must be at least 8 characters long.' } })
          return false
        }
        return true
    }
  }

  const handleSignup = async (event) => {
    event.preventDefault()

    try {
      const response = await authorizedFetch('api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: state.username,
          email: state.email,
          password: state.password,
          code: state.code
        })
      })

      if (response.ok) {
        signin()
        dispatch({ type: 'SIGNUP_SUCCESS' })
        onSignupSuccess()
      } else {
        // Rework API on this..
        console.log('Signup failed')
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleVerifyEmail = async () => {
    try {
      // Validation of user data
      const username = checkValidationOfData('username', state.username) ? state.username : false
      const email = checkValidationOfData('email', state.email) ? state.email : false
      const password = checkValidationOfData('password', state.password) ? state.password : false

      if (!username || !email || !password) return

      // Verify email start
      const response = await fetch('api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: state.username,
          email: state.email
        })
      })
      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.message)
      }

      const code = await response.json()

      if (code) {
        dispatch({ type: 'SIGNUP_PHASE_CHANGE', payload: { phase: 2 } })
      } else {
        dispatch({ type: 'SIGNUP_VERIFICATION_ERROR', payload: { msg: 'Failed to send verification email.' } })
      }
      dispatch({ type: 'SIGNUP_RATELIMIT_ENABLED', payload: { enabled: true } })
    } catch (err) {
      switch (err.message) {
        case 'Failed! Username is already taken!':
          dispatch({ type: 'SIGNUP_USERNAME_ERROR', payload: { msg: err.message } })
          break
        case 'Failed! Email is already in use!':
          dispatch({ type: 'SIGNUP_EMAIL_ERROR', payload: { msg: err.message } })
          break
        default:
          dispatch({ type: 'SIGNUP_VERIFICATION_ERROR', payload: { msg: 'Failed to send verification email.' } })
          break
      }
    }
  }

  const handleVerifyCode = async (e) => {
    e.preventDefault()

    if (state.code.length !== 6) return dispatch({ type: 'SIGNUP_VERIFICATION_ERROR', payload: { msg: 'Code incomplete (lenght must be 6)' } })

    try {
      const response = await fetch('api/auth/verify-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: state.email,
          code: state.code
        })
      })

      if (!response.ok) {
        const err = await response.json()
        return dispatch({ type: 'SIGNUP_VERIFICATION_ERROR', payload: { msg: err.message } })
      }
      if (response.ok) dispatch({ type: 'SIGNUP_PHASE_CHANGE', payload: { phase: 3 } })
    } catch (err) {
      console.log(err)
    }
  }

  const handleInputCodeChange = (e) => {
    if (isNaN(e.target.value)) e.target.value = state.code
    dispatch({ type: 'SIGNUP_CODE_CHANGE', payload: { code: e.target.value } })
  }

  const handleCloseSignUp = (e) => {
    e.preventDefault()
    onClose()
  }

  useEffect(() => {
    const decrementTimer = () => {
      if (state.rateLimitTimer > 0) {
        dispatch({ type: 'SIGNUP_RATE_LIMIT_TIMER', payload: { timer: state.rateLimitTimer - 1 } })
      } else {
        dispatch({ type: 'SIGNUP_RATE_LIMIT_ENABLED', payload: { enabled: false } })
      }
    }

    if (state.rateLimitEnabled) {
      const rateInterval = setInterval(() => {
        decrementTimer()
      }, 1000)

      return () => {
        clearInterval(rateInterval)
      }
    }
  }, [state.rateLimitEnabled, state.rateLimitTimer])

  return (
    <div className='signup-form-container' aria-label='signup-container'>
      <div className='signup-form-container-close'>
        <button type='button' aria-label='close-button' name='closeSignup' onClick={(e) => handleCloseSignUp(e)}>
        </button>
      </div>
      <h2>Registration</h2>
      {state.phase === 1
        ? (
      <form aria-label='signup-container-form'>
        <div className='signup-form-inputs'>
        <input
            type='text'
            className={state.usernameError ? 'username error' : 'username'}
            name='username'
            value={state.username}
            onChange={handleUsernameChange}
            placeholder='Username'
          />
        {state.usernameError
          ? (
          <label htmlFor='username' style={{ color: 'red' }}>
            {state.usernameErrorMsg}
          </label>
            )
          : (<></>)
        }
        <input
            type='text'
            className={state.emailError ? 'email error' : 'email'}
            name='email'
            value={state.email}
            onChange={handleEmailChange}
            placeholder='Email'
          />
        {state.emailError
          ? (
            <label htmlFor='Email' style={{ color: 'red' }}>
              {state.emailErrorMsg}
            </label>
            )
          : (<></>)
        }
          <input
            type='password'
            className={state.passwordError ? 'password error' : 'password'}
            name='password'
            value={state.password}
            onChange={handlePasswordChange}
            placeholder='Password'
          />
        {state.passwordError
          ? (
            <label htmlFor='password' style={{ color: 'red' }}>
              {state.passwordErrorMsg}
            </label>
            )
          : (<></>)
        }
        </div>
        <button type='button' aria-label='verify-button' name='verifySubmit' onClick={handleVerifyEmail}>
          Verify
        </button>
      </form>
          )
        : null}
      {state.phase === 2 || state.phase === 3
        ? (
        <form onSubmit={(e) => handleVerifyCode(e)} aria-label='signup-container-form' className='verify-code'>
          {state.phase === 2
            ? (<>
          <h3>Verification</h3>
          <input type='text' className={state.verificationError ? 'error' : null} name='code' value={state.code} onChange={(e) => handleInputCodeChange(e)} size="6" maxLength="6" placeholder='CODE' autoFocus autoComplete='off'/>
          <label htmlFor='code' className='verify-code-error'>
            {state.verificationErrorMsg}
          </label></>)
            : (<span className='verify-code-success'>Email verified!</span>)}
          <div className='signup-form-verify-buttons'>
          {state.phase === 2
            ? (
            <>
            <button type='submit' aria-label='verify-button' name='verifySubmit'>
            Verify
          </button>
          <button type='button' className={state.rateLimitEnabled ? 'resend disabled' : 'resend'} disabled={state.rateLimitEnabled} onClick={handleVerifyEmail}>
          {!state.rateLimitEnabled ? 'Resend' : 'Resend ' + state.rateLimitTimer + 's'}
          </button></>)
            : (<button type='button' onClick={(e) => handleSignup(e)}>
            Sign up
          </button>)}
          </div>
        </form>
          )
        : null}
    </div>
  )
}

Signup.propTypes = {
  onSignupSuccess: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired
}

export default Signup
