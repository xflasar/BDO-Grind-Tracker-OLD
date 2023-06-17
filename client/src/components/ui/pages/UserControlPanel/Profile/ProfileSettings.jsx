import React, { useContext, useState, useEffect } from 'react'
import '../../../../../assets/pages/UserControlPanel/ProfileSettings/ProfileSettings.scss'
import { SessionContext } from '../../../../../contexts/SessionContext'

const ProfileSettings = () => {
  const [userSettings, setUserSettings] = useState(null)
  const { isSignedIn } = useContext(SessionContext)

  /* async function FetchUserData () {
    const response = await authorizedFetch('api/user/userdatasettings')
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
    setUserSettings(null)
    // FetchUserData()
  }, [])
  return (
        <div aria-label='profileSettings-container' className='profileSettings-container'>
            {console.log(userSettings)}
            {userSettings
              ? (
            <form aria-label='profileSettings-container-form'>
                <label htmlFor='serverorregion'>Server/Region:</label>
                <input type='text' id='serverorregion' name='serverorregion' placeholder='Server/Region' value={userSettings.ServerRegion} />
                <label htmlFor='grindingPreference'>Grinding preference:</label>
                <input type='text' id='displayName' name='displayName' placeholder='Display name' value={userSettings.displayName} />
                <label htmlFor='familyName'>Family name:</label>
                <input type='text' id='familyName' name='familyName' placeholder='Family name' value={userSettings.familyName} />
            </form>)
              : (<h1>UserSettings not available</h1>)}
        </div>
  )
}

export default ProfileSettings
