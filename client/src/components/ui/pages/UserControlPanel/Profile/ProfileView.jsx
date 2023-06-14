import React, { useContext, useState, useEffect } from 'react'
import '../../../../../assets/pages/UserControlPanel/ProfileView/ProfileView.scss'
import { SessionContext } from '../../../../../contexts/SessionContext'

const ProfileView = () => {
  const { isSignedIn } = useContext(SessionContext)
  const [user, setUser] = useState(null)
  const [userUsername, setUserUsername] = useState('')
  const [userDisplayName, setUserDisplayName] = useState('')
  const [userFamilyName, setUserFamilyName] = useState('')

  async function fetchUserData () {
    const response = await fetch('api/user/userprofiledata')
    const data = await response.json()
    if (data) {
      setUser(data)
      if (data.Username) setUserUsername(data.Username)
      if (data.DisplayName) setUserDisplayName(data.DisplayName)
      if (data.FamilyName) setUserFamilyName(data.FamilyName)
    }
  }

  useEffect(() => {
    if (!isSignedIn) {
      window.location.href = '/'
      return
    }

    if (!user) {
      fetchUserData()
    }
  }, [isSignedIn, user])

  if (!user) {
    return <h1>UserProfileData not available</h1>
  }

  const handleUsernameChange = (e) => {
    setUserUsername(e.target.value)
  }

  const handleDisplayNameChange = (e) => {
    setUserDisplayName(e.target.value)
  }

  const handleFamilyNameChange = (e) => {
    setUserFamilyName(e.target.value)
  }

  const handleButtonUpdate = async (e) => {
    e.preventDefault()
    const data = {
      Username: userUsername,
      DisplayName: userDisplayName,
      FamilyName: userFamilyName
    }

    const response = await fetch('api/user/setuserprofiledata', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })

    const res = await response.json()

    if (res && !res.ok) {
      console.log('Error occurred: ' + res.message)
    }
  }

  return (

    <div aria-label='profileView-container' className='profileView-container'>
        {user && (
      <form aria-label='profileView-container-form'>
        <div className='profileView-container-form-inputlabel'>
          <label htmlFor='username'>Username:</label>
          <input type='text' id='username' name='username' placeholder='Username' value={userUsername} onChange={handleUsernameChange} disabled={true}/>
          <label htmlFor='displayName'>Display name:</label>
          <input type='text' id='displayName' name='displayName' placeholder='Display name' value={userDisplayName} onChange={handleDisplayNameChange} />
          <label htmlFor='familyName'>Family name:</label>
          <input type='text' id='familyName' name='familyName' placeholder='Family name' value={userFamilyName} onChange={handleFamilyNameChange} />
        </div>
        <button id='profileViewUpdateButton' name='profileViewUpdateButton' onClick={handleButtonUpdate}>Update</button>
      </form>
        )}
    </div>

  )
}

export default ProfileView
