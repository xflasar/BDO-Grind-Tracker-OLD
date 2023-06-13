import React, { useEffect, useContext, useState } from 'react'
import '../../assets/pages/UserControlPanel/Profile.scss'
import { SessionContext } from '../../contexts/SessionContext'
import ProfileNavigation from '../../components/ui/pages/UserControlPanel/ProfileNavigation'
import ProfileView from '../../components/ui/pages/UserControlPanel/Profile/ProfileView'
import ProfileSettings from '../../components/ui/pages/UserControlPanel/Profile/ProfileSettings'
import ProfileSecurity from '../../components/ui/pages/UserControlPanel/Profile/ProfileSecurity'

function Profile () {
  const { isSignedIn } = useContext(SessionContext)
  const [currentNav, setCurrentNav] = useState('Profile')
  // const [userData, setUserData] = useState(null)
  // const [dataError, setDataError] = useState(false)

  /* async function FetchUserData () {
    try {
      const response = await fetch('api/user/userprofiledata')
      const data = await response.json()
      if (data && data.message !== 'Failed to fetch userprofiledata!') {
        setUserData(data)
      } else {
        setUserData(null)
        console.log('Failed to fetch userprofiledata ', data.message)
      }
    } catch (err) {
      setUserData(null)
      console.log(err)
    }
  } */

  const handleNavPage = (curNavPageString) => {
    setCurrentNav(curNavPageString)
  }
  useEffect(() => {
    if (!isSignedIn) {
      window.location.href = '/'
    }
    // FetchUserData()

    /*  if (!userData) {
      setDataError(true)
    } else {
      setDataError(false)
    } */
  }, [])
  return (
        <div aria-label='profile-container' className='profile-container'>
            <ProfileNavigation navPage={handleNavPage}/>
            {currentNav === 'Profile' && <ProfileView />}
            {currentNav === 'Security' && <ProfileSecurity />
}
            {currentNav === 'Settings' && <ProfileSettings />}
            {/* {dataError && (
                <></>
            )} */}
        </div>
  )
}

export default Profile
