import React, { useState } from 'react'
import HistoryTable from '../../components/ui/HistoryTable'
import Cookies from 'js-cookie'
import '../../assets/History/History.scss'

function History () {
  const [data, setData] = useState(null)
  const [session, setSession] = useState(Cookies.get('token'))
  async function handleFetchData () {
    const res = await fetch('api/user/historydata')
    const data = await res.json()
    return data
  }

  React.useEffect(() => {
    const defaultData = [
    ]
    setSession(Cookies.get('token'))
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
    <>
      {session && (
        <div role='historyContainer'>
          <div className="sessionAdd">
            <button name='sessionAdd'>Add Session</button>
          </div>
          <div className="history-table-container">
            {data && data.length > 0 && <HistoryTable data={data} />}
          </div>
        </div>
      )}
    </>
  )
}
export default History
