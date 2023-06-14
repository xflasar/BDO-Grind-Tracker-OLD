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

  const handleNavPage = (curNavPageString) => {
    setCurrentNav(curNavPageString)
  }
  useEffect(() => {
    if (!isSignedIn) {
      window.location.href = '/'
    }
  }, [])
  return (
        <div aria-label='profile-container' className='profile-container'>
            <ProfileNavigation navPage={handleNavPage}/>
            {currentNav === 'Profile' && <ProfileView />}
            {currentNav === 'Security' && <ProfileSecurity />}
            {currentNav === 'Settings' && <ProfileSettings />}
        </div>
  )
}

export default Profile
