import React, { useContext, useState, useEffect } from 'react'
import '../../../../../assets/pages/UserControlPanel/ProfileSecurity/ProfileSecurity.scss'
import { SessionContext } from '../../../../../contexts/SessionContext'

const ProfileSecurity = () => {
  const [userSecurity, setUserSecurity] = useState(null)
  const { isSignedIn } = useContext(SessionContext)

  /* async function FetchUserData () {
    const response = await fetch('api/user/userdatasettings')
    const data = await response.json()
    console.log(data)
    if (data) {
      setUserSettings(data)
    }
  } */

  useEffect(() => {
    if (!isSignedIn) {
      window.location.href = '/'
      return
    }
    setUserSecurity(null)
    // FetchUserData()
  }, [])
  return (
        <div aria-label='profileSettings-container' className='profileSettings-container'>
            {console.log(userSecurity)}
            {userSecurity
              ? (
            <form aria-label='profileSettings-container-form'>
                <label htmlFor='serverorregion'>Server/Region:</label>
                <input type='text' id='serverorregion' name='serverorregion' placeholder='Server/Region' value={userSecurity.ServerRegion} />
                <label htmlFor='grindingPreference'>Grinding preference:</label>
                <input type='text' id='displayName' name='displayName' placeholder='Display name' value={userSecurity.displayName} />
                <label htmlFor='familyName'>Family name:</label>
                <input type='text' id='familyName' name='familyName' placeholder='Family name' value={userSecurity.familyName} />
            </form>)
              : (<h1>UserSecurity not available</h1>)}
        </div>
  )
}

export default ProfileSecurity
