import React, { useContext, useState, useEffect } from 'react'
import '../../../../../assets/pages/UserControlPanel/ProfileView/ProfileView.scss'
import { SessionContext } from '../../../../../contexts/SessionContext'

const ProfileView = () => {
  const { isSignedIn, authorizedFetch } = useContext(SessionContext)
  const [user, setUser] = useState(null)
  const [userDisplayName, setUserDisplayName] = useState('')
  const [userFamilyName, setUserFamilyName] = useState('')

  async function fetchUserData () {
    const response = await authorizedFetch('api/user/userprofiledata')
    const data = await response.json()
    if (data) {
      setUser(data)
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

  const handleDisplayNameChange = (e) => {
    setUserDisplayName(e.target.value)
  }

  const handleFamilyNameChange = (e) => {
    setUserFamilyName(e.target.value)
  }

  const handleButtonUpdate = async (e) => {
    e.preventDefault()
    const data = {
      DisplayName: userDisplayName,
      FamilyName: userFamilyName
    }

    await authorizedFetch('api/user/setuserprofiledata', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }).then((res) => {
      if (!res.ok) {
        console.log('Profile update failed')
        // Handle failed update
        return
      }
      console.log('Profile update success')
      return res.json()
    })
  }

  return (
    <div aria-label='profileView-container' className='profileView-container'>
        {user && (
      <form aria-label='profileView-container-form'>
        <div className='profileView-container-form-inputlabel'>
          <label htmlFor='username'>Username:</label>
          <input type='text' id='username' name='username' placeholder='Username' value={user.Username} disabled={true}/>
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
