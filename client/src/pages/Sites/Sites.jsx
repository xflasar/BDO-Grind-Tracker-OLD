import React from 'react'
import '../../assets/Sites.scss'
import SiteBox from '../../components/ui/SiteBox'
import Cookies from 'js-cookie'

function Sites () {
  const [data, setData] = React.useState(null)

  /* async function handleFetchData () {
    const res = await fetch('api/user/sites')
    const data = await res.json()
    return data
  } */

  React.useEffect(() => {
    const defaultData = {
      Site1: {
        SiteName: 'Loading...',
        TotalTime: 'Loading...',
        TotalEarned: 'Loading...',
        TotalSpent: 'Loading...',
        AverageEarnings: 'Loading...'
      },
      Site2: {
        SiteName: 'Loading...',
        TotalTime: 'Loading...',
        TotalEarned: 'Loading...',
        TotalSpent: 'Loading...',
        AverageEarnings: 'Loading...'
      },
      Site3: {
        SiteName: 'Loading...',
        TotalTime: 'Loading...',
        TotalEarned: 'Loading...',
        TotalSpent: 'Loading...',
        AverageEarnings: 'Loading...'
      },
      Site4: {
        SiteName: 'Loading...',
        TotalTime: 'Loading...',
        TotalEarned: 'Loading...',
        TotalSpent: 'Loading...',
        AverageEarnings: 'Loading...'
      }
    }

    const session = Cookies.get('token')
    if (!session) {
      setData(defaultData)
      return
    }
    setData(defaultData)
    /*
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
      }) */
  }, [])

  return (
        <div className="sites-container">
            {data && Object.values(data).map((item, index) => {
              return <SiteBox key={index} data={item}/>
            })}
        </div>
  )
}
export default Sites
