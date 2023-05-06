import React, { useState } from 'react'
import HistoryTable from '../../components/ui/HistoryTable'
import Cookies from 'js-cookie'

// import "../../assets/History.css";

function History () {
  const [data, setData] = useState(null)

  async function handleFetchData () {
    const res = await fetch('api/user/historydata')
    const data = await res.json()
    return data
  }

  React.useEffect(() => {
    const defaultData = undefined
    const session = Cookies.get('token')
    if (!session) {
      setData(defaultData)
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
  }, [])

  return (
        <div role='historyContainer' className="history-table-container">
            {data && <HistoryTable data={data} />}
        </div>
  )
}
export default History
