import React, { useContext, useReducer } from 'react'
import PropTypes from 'prop-types'
import '../../../assets//components/ui/Signup/Signup.scss'
import { SessionContext } from '../../../contexts/SessionContext'
import { INITIAL_STATE, signupReducer } from './signupReducer'

const Signup = ({ onSignupSuccess }) => {
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

    const username = checkValidationOfData('username', state.username) ? state.username : false
    const email = checkValidationOfData('email', state.email) ? state.email : false
    const password = checkValidationOfData('password', state.password) ? state.password : false

    if (username === false || email === false || password === false) return

    try {
      const response = await authorizedFetch('api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username,
          email,
          password
        })
      })
      if (response.ok) {
        signin()
        onSignupSuccess()
        dispatch({ type: 'SIGNUP_SUCCESS' })
      } else {
        const res = response.JSON()
        switch (res.message) {
          case 'Failed! Username is already in use!':
            dispatch({ type: 'SIGNUP_USERNAME_ERROR', payload: { msg: 'Username is already in use.' } })
            break
          case 'Failed! Email is already in use!':
            dispatch({ type: 'SIGNUP_EMAIL_ERROR', payload: { msg: 'Email is already in use.' } })
            break
          case 'Validation fail.':
            res.errorsList.forEach(error => {
              switch (error.type) {
                case 'username':
                  dispatch({ type: 'SIGNUP_USERNAME_ERROR', payload: { msg: error.message } })
                  break
                case 'email':
                  dispatch({ type: 'SIGNUP_EMAIL_ERROR', payload: { msg: error.message } })
                  break
                case 'password':
                  dispatch({ type: 'SIGNUP_PASSWORD_ERROR', payload: { msg: error.message } })
                  break
              }
            })
            break
        }
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className='signup-form-container' aria-label='signup-container'>
      <form onSubmit={handleSignup} aria-label='signup-container-form'>
        <h2>Registration</h2>
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
        <button type='submit' aria-label='signup-button' name='signupSubmit'>
          Register
        </button>
      </form>
    </div>
  )
}

Signup.propTypes = {
  onSignupSuccess: PropTypes.func.isRequired
}

export default Signup
