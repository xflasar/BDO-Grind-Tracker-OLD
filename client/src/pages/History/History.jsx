import React, { useState } from 'react'
import HistoryTable from '../../components/ui/HistoryTable'
import Cookies from 'js-cookie'
import '../../assets/History/History.scss'

function History () {
  const [data, setData] = useState(null)
  const [session, setSession] = useState(Cookies.get('token'))
  const [addSession, setAddSession] = useState(false)

  async function handleFetchData () {
    const res = await fetch('api/user/historydata')
    const data = await res.json()
    return data
  }

  async function handleAddSession () {
    if (addSession === false) {
      setAddSession(true)
    } else {
      setAddSession(false)
    }
  }

  async function handleAddSessionSubmit (e) {
    e.preventDefault()
    const SiteName = e.target.siteName.value
    const TimeSpent = e.target.timeSpent.value
    const TotalEarned = e.target.earnings.value
    const AverageEarnings = e.target.averageEarnings.value
    const TotalSpent = e.target.expenses.value
    const Gear = {
      TotalAP: e.target.AP.value,
      TotalDP: e.target.DP.value
    }
    const res = await fetch('api/user/addsession', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        SiteName,
        TimeSpent,
        TotalEarned,
        AverageEarnings,
        TotalSpent,
        Gear
      })
    })
    const data = await res.json()
    setData(data)
    setAddSession(false)
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
            <button name='sessionAdd' onClick={handleAddSession}>Add Session</button>
          </div>
          {addSession && (
            <div className="sessionAddForm">
              <form onSubmit={handleAddSessionSubmit}>
                <label htmlFor="siteName">Site Name</label>
                <input type="text" name="siteName" id="siteName" />
                <label htmlFor="timeSpent">Time Spent</label>
                <input type="text" name="timeSpent" id="timeSpent" />
                <label htmlFor="earnings">Earnings</label>
                <input type="text" name="earnings" id="earnings" />
                <label htmlFor="averageEarnings">Average Earnings</label>
                <input type="text" name="averageEarnings" id="averageEarnings" />
                <label htmlFor="expenses">Expenses</label>
                <input type="text" name="expenses" id="expenses" />
                <label htmlFor="gear">Gear</label>
                <input type="text" name="AP" id="AP" />
                <input type="text" name="DP" id="DP" />
                <button type='submit' name='sessionAddSubmit'>Submit</button>
              </form>
            </div>
          )}
          <div className="history-table-container">
            {data && data.length > 0 && <HistoryTable data={data} />}
          </div>
        </div>
      )}
    </>
  )
}
export default History
