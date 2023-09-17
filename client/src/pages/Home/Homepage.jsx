import React, { useContext } from 'react'
import '../../assets/pages/Homepage/Homepage.scss'
import { SessionContext } from '../../contexts/SessionContext'
import GuestHomepage from './GuestHomepage'
import UserHomepage from './UserHomepage'

function Homepage () {
  const { isSignedIn } = useContext(SessionContext)

  return (
    <>
    {isSignedIn ? <UserHomepage/> : <GuestHomepage />}
    </>
  )
}

export default Homepage
