import React, { useState, useEffect } from 'react'
import HistoryTable from '../../components/ui/pages/History/HistoryTable'
import EditSession from '../../components/form/editSession'
import Cookies from 'js-cookie'
import '../../assets/pages/History/History.scss'
import AddSession from '../../components/form/addNewSession'

function History () {
  const [data, setData] = useState([])
  const [editData, setEditData] = useState(null)
  const [session, setSession] = useState(Cookies.get('token'))
  const [addSession, setAddSession] = useState(false)
  const [editSession, setEditSession] = useState(false)

  async function fetchHistoryData () {
    try {
      const res = await fetch('api/user/historydata')
      const data = await res.json()
      return data
    } catch (error) {
      console.log('Failed to fetch history data:', error)
      return []
    }
  }

  useEffect(() => {
    setSession(Cookies.get('token'))

    if (!session) {
      setData([])
      return
    }

    fetchHistoryData()
      .then((data) => {
        if (data.message === 'No token provided!') {
          setData([])
          return
        }
        setData(data)
      })
      .catch(() => {
        setData([])
      })
  }, [session])

  function handleAddSession () {
    setAddSession(!addSession)
  }

  function handleEditSession (data) {
    if (editSession) {
      setEditSession(false)
      setTimeout(() => {
        setEditData(data)
        setEditSession(true)
      }, 150)
    } else {
      setEditData(data)
      setEditSession(true)
    }
  }

  async function handleDeleteSession (id) {
    try {
      const res = await fetch('api/user/deletesession', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          SessionId: id
        })
      })
      const confirmation = await res.json()
      if (confirmation.message === 'Session deleted!') {
        fetchHistoryData().then((data) => setData(data))
      } else {
        // Handle Error when confirmation is false
      }
    } catch (error) {
      console.error('Failed to delete session:', error)
    }
  }

  async function handleEditSessionSubmit (data) {
    try {
      const res = await fetch('api/user/modifysession', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      const dataRes = await res.json()
      setData(dataRes)
      setEditSession(false)
    } catch (error) {
      console.error('Failed to edit session:', error)
    }
  }

  function handleEditSessionSuccess () {
    fetchHistoryData()
      .then((data) => {
        setData(data)
        setEditSession(false)
      })
      .catch((error) => {
        console.error('Failed to fetch history data:', error)
      })
  }

  async function handleOnAddSessionSuccess (obj) {
    setData(obj.Data)
    setAddSession(obj.setAddSession)
  }

  return (
    <>
      {session && (
        <div role="historyContainer">
          <div className="sessionAdd">
            <button name="sessionAdd button" onClick={handleAddSession}>
              Add Session
            </button>
          </div>
          {addSession && (
            <AddSession
            onAddSessionSuccess={handleOnAddSessionSuccess}
            onCloseClick={(BoolState) => setAddSession(BoolState)}
            />
          )}
          {editSession && (
            <EditSession
              data={editData}
              onEditSuccess={handleEditSessionSuccess}
              onEditSessionSubmit={handleEditSessionSubmit}
              onCloseClick={(BoolState) => setEditSession(BoolState)}
            />
          )}
          <div className="history-table-container">
            {data.length > 0 && (
              <HistoryTable
                onEditTrigger={handleEditSession}
                onDeleteTrigger={handleDeleteSession}
                data={data}
              />
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default History
