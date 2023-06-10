import React, { useState, useEffect, useContext } from 'react'
import '../../assets/pages/Sites/Sites.scss'
import SiteBox from '../../components/ui/pages/Sites/SiteBox'
import { SessionContext } from '../../contexts/SessionContext'

function Sites () {
  const [data, setData] = useState(null)
  const { isSignedIn } = useContext(SessionContext)

  async function handleFetchData () {
    const res = await fetch('api/user/sitedata')
    const data = await res.json()
    return data
  }

  useEffect(() => {
    const defaultData = {}
    if (!isSignedIn) {
      setData({})
      return
    }

    handleFetchData()
      .then((data) => {
        if (data.message === 'No token provided!') {
          setData(defaultData)
          return
        }
        setData(data)
      })
      .catch(() => {
        setData(defaultData)
      })
  }, [isSignedIn])

  return (
        <div className="sites-container">
            {data && Object.values(data).map((item, index) => {
              return <SiteBox key={index} data={item}/>
            })}
        </div>
  )
}
export default Sites
