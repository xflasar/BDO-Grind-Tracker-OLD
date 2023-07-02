import React from 'react'
import PropTypes from 'prop-types'
import '../../../../assets/components/ui/UserControlPanel/ProfileNavigation/ProfileNavigation.scss'

const ProfileNavigation = ({ navPage }) => {
  const handleProfileClick = () => {
    navPage('Profile')
  }
  const handleSecurityClick = () => {
    navPage('Security')
  }
  const handleSettingsClick = () => {
    navPage('Settings')
  }
  return (
        <div aria-label='profileNavigation' className='profile-navigation-container'>
            <nav aria-label='profilenavigationnav' className='profile-navigation-nav'>
                <ul>
                    <li>
                        <button aria-label='profileButton' onClick={() => handleProfileClick()}>Profile</button>
                    </li>
                    <li>
                        <button aria-label='securityButton' onClick={() => handleSecurityClick()}>Security</button>
                    </li>
                    <li>
                        <button aria-label='settingsButton' onClick={() => handleSettingsClick()}>Settings</button>
                    </li>
                </ul>
            </nav>
        </div>
  )
}

ProfileNavigation.propTypes = {
  navPage: PropTypes.func.isRequired
}

export default ProfileNavigation
