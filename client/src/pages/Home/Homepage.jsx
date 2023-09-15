import React, { useContext } from 'react'
import '../../assets/pages/Homepage/Homepage.scss'
import { SessionContext } from '../../contexts/SessionContext'
import GuestHomepage from './GuestHomepage'
import UserHomepage from './UserHomepage'

function Homepage () {
  const { isSignedIn } = useContext(SessionContext)

  async function fetchDataDebug () {
    const c = await fetch('/api/user/debug')
    const d = await c.json()
    console.log(d)
  }

  React.useEffect(() => {
    fetchDataDebug()
  }, [])

  return (
    <>
    {isSignedIn ? <UserHomepage/> : <GuestHomepage />}
    </>
  )
}

export default Homepage
