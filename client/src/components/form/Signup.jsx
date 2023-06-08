import React, { useState } from 'react'
import PropTypes from 'prop-types'
import '../../assets/components/ui/Signup/Signup.scss'

function Signup ({ onSignupSuccess }) {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [usernameError, setUsernameError] = useState(false)

  const handleUsernameChange = (e) => {
    setUsername(e.target.value)
    setUsernameError(false)
  }

  const handleEmailChange = (e) => {
    setEmail(e.target.value)
  }

  const handlePasswordChange = (e) => {
    setPassword(e.target.value)
  }

  const handleSignup = async (event) => {
    event.preventDefault()
    try {
      const response = await fetch('api/auth/signup', {
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
      console.log('Passed')
      console.log(res)
      if (res.accessToken) {
        console.log('called access!')
        document.cookie = `token=${res.accessToken}; path=/;`
        onSignupSuccess(res.accessToken)
        setUsername('')
        setEmail('')
        setPassword('')
      } else {
        console.log('else')
        if (res.message === 'Failed! Username is already in use!') {
          setUsernameError(true)
          console.log('called error!')
          setUsername('')
          setPassword('')
        } else if (res.message === 'Failed! Email is already in use!') {
          // Not implemented most likely I won't implement it but 80% I will no need for multiple accounts under same email address...
        }
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
        <div className="signup-form-container">
          <form onSubmit={handleSignup}>
              <h2>Registration</h2>
              <label htmlFor="username">Username:</label>
              {!usernameError ? <input type="text" className='username' name="username" value={username} onChange={handleUsernameChange} placeholder='Username'/> : (<><input type="text" className='username error' name="username" value={username} onChange={handleUsernameChange} placeholder='Username'/> <label htmlFor="username" style={{ color: 'red' }}>Account with username already exists!</label></>)}
              <label htmlFor="email">Email:</label>
              <input type="text" name="email" id="email" onChange={handleEmailChange} value= {email}/>
              <label htmlFor="password">Password:</label>
              <input type="password" name="password" id="password" onChange= {handlePasswordChange} value={password}/>
              <button type="submit" name="signupSubmit">Register</button>
          </form>
        </div>
  )
}

Signup.propTypes = {
  onSignupSuccess: PropTypes.func.isRequired
}

export default Signup
