import React, { useState, useEffect, useContext } from 'react'
import Box from '../../components/ui/pages/Homepage/HomepageBox'
import '../../assets/pages/Homepage/Homepage.scss'
import { SessionContext } from '../../contexts/SessionContext'

function Homepage () {
  const [data, setData] = useState(null)
  const { isSignedIn, authorizedFetch } = useContext(SessionContext)

  async function handleFetchData () {
    const res = await authorizedFetch('api/user/homepage')
    const data = await res.json()
    return data
  }
  useEffect(() => {
    const noDataContent = 'No data!'
    const defaultData = {
      Box1: { Content: noDataContent },
      Box2: { Content: noDataContent },
      Box3: { Content: noDataContent },
      Box4: { Content: noDataContent },
      Box5: { Content: noDataContent }
    }

    if (!isSignedIn) {
      setData(defaultData)
      return
    }

    handleFetchData()
      .then((data) => {
        if (data.message === 'No token provided!' || data.length < 4) {
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
    <div className="Homepage">
      <div className="box-container">
        {data && Object.values(data).map((item, index) => {
          return (
          <Box key={index} className={`box-${index + 1}`} data={item}/>
          )
        })}
      </div>
    </div>
  )
}
export default Homepage
