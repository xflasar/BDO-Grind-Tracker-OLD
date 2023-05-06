import React from 'react'
import Box from '../../components/ui/HomepageBox'
import Cookies from 'js-cookie'
import '../../assets/Homepage.scss'

function Homepage () {
  const [data, setData] = React.useState(null)

  async function handleFetchData () {
    const res = await fetch('api/user/homepage')
    const data = await res.json()
    return data
  }
  React.useEffect(() => {
    const noDataContent = 'No data!'
    const defaultData = {
      Box1: { Content: noDataContent },
      Box2: { Content: noDataContent },
      Box3: { Content: noDataContent },
      Box4: { Content: noDataContent },
      Box5: { Content: noDataContent }
    }
    const session = Cookies.get('token')
    if (!session) {
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
  }, [])

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
