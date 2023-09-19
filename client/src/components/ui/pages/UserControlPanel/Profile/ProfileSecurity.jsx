import React, { useContext, useState, useEffect } from 'react'
import '../../../../../assets/pages/UserControlPanel/ProfileSecurity/ProfileSecurity.scss'
import { SessionContext } from '../../../../../contexts/SessionContext'

const ProfileSecurity = () => {
  const { isSignedIn, authorizedFetch } = useContext(SessionContext)
  const [userPassword, setUserPassword] = useState('')
  const [userNewPassword, setUserNewPassword] = useState('')
  const [userNewPasswordConfirm, setUserNewPasswordConfirm] = useState('')

  const SubmitSecurityData = async (e) => {
    e.preventDefault()
    if (userNewPassword !== userNewPasswordConfirm) {
      console.log('Passwords doesn`t match!!') // fixme: add to state and show this for user to know
      return
    }

    const response = await authorizedFetch('api/user/setusersecuritydata', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userPassword,
        userNewPassword
      })
    })
    // show this for user to know
    const data = await response.json()
    console.log(data)
  }

  const handlePasswordChange = (e) => {
    setUserPassword(e.target.value)
  }

  const handleNewPasswordChange = (e) => {
    setUserNewPassword(e.target.value)
  }

  const handleNewPasswordConfirmChange = (e) => {
    setUserNewPasswordConfirm(e.target.value)
  }

  useEffect(() => {
    if (!isSignedIn) {
      window.location.href = '/'
    }
  }, [])

  return (
        <div aria-label='profileSecurity-container' className='profileSecurity-container'>
            <form aria-label='profileSecurity-container-form'>
              <div className='profileSecurity-container-form-inputlabel'>
                <label htmlFor='password'>Password:</label>
                <input type='password' id='password' name='password' placeholder='Password' value={userPassword} onChange={handlePasswordChange}/>
                <label htmlFor='newPassword'>New Password:</label>
                <input type='password' id='newPassword' name='newPassword' placeholder='New Password' value={userNewPassword} onChange={handleNewPasswordChange} />
                <label htmlFor='passwordConfirm'>Confirm New Password:</label>
                <input type='password' id='passwordConfirm' name='passwordConfirm' placeholder='Confirm new password' value={userNewPasswordConfirm} onChange={handleNewPasswordConfirmChange}/>
                </div>
                <button id='profileSecurityChangeButton' name='profileSecurityChangeButton' onClick={SubmitSecurityData}>Change password</button>
            </form>
        </div>
  )
}

export default ProfileSecurity
