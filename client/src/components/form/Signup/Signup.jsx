import React, { useContext, useReducer } from 'react'
import PropTypes from 'prop-types'
import '../../../assets//components/ui/Signup/Signup.scss'
import { SessionContext } from '../../../contexts/SessionContext'
import { INITIAL_STATE, signupReducer } from './signupReducer'

const Signup = ({ onSignupSuccess }) => {
  const { authorizedFetch, signin } = useContext(SessionContext)
  const [state, dispatch] = useReducer(signupReducer, INITIAL_STATE)

  const handleUsernameChange = (e) => {
    dispatch({ type: 'SIGUNP_INPUT_CHANGE', payload: { name: e.target.name, value: e.target.value } })
  }

  const handleEmailChange = (e) => {
    dispatch({ type: 'SIGNUP_INPUT_CHANGE', payload: { name: e.target.name, value: e.target.value } })
  }

  const handlePasswordChange = (e) => {
    dispatch({ type: 'SIGNUP_INPUT_CHANGE', payload: { name: e.targe.name, value: e.target.value } })
  }

  const handleSignup = async (event) => {
    event.preventDefault()

    const username = state.username
    const email = state.email
    const password = state.password

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
      const res = await response.json()
      if (res.accessToken) {
        signin(res.accessToken)
        onSignupSuccess()
        dispatch({ type: 'SIGNUP_SUCCESS' })
      } else {
        if (res.message === 'Failed! Username is already in use!') {
          dispatch({ type: 'SIGNUP_FAIL' })
        } else if (res.message === 'Failed! Email is already in use!') {
          // Not implemented most likely I won't implement it, but 80% I will no need for multiple accounts under the same email address...
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
        {!state.usernameError
          ? (
          <input
            type='text'
            className='username'
            name='username'
            value={state.username}
            onChange={handleUsernameChange}
            placeholder='Username'
          />
            )
          : (
          <>
            <input
              type='text'
              className='username error'
              name='username'
              value={state.username}
              onChange={handleUsernameChange}
              placeholder='Username'
            />
            <label htmlFor='username' style={{ color: 'red' }}>
              Account with username already exists!
            </label>
          </>
            )}
        <input
          type='text'
          name='email'
          id='email'
          onChange={handleEmailChange}
          value={state.email}
          placeholder='Email'
        />
        <input
          type='password'
          name='password'
          id='password'
          onChange={handlePasswordChange}
          value={state.password}
          placeholder='Password'
        />
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
