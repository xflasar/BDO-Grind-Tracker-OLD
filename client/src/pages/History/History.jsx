import React, { useEffect, useContext, useReducer } from 'react'
import HistoryTable from '../../components/ui/pages/History/HistoryTable'
import EditSession from '../../components/form/EditSession/editSession'
import '../../assets/pages/History/History.scss'
import AddSession from '../../components/form/AddSession/addSession'
import { SessionContext } from '../../contexts/SessionContext'
import { INITIAL_STATE, historyReducer } from './historyReducer'
import SessionViewer from '../../components/ui/pages/History/HistorySessionViewer'

function History () {
  const { isSignedIn, authorizedFetch } = useContext(SessionContext)
  const [state, dispatch] = useReducer(historyReducer, INITIAL_STATE)

  async function fetchHistoryData () {
    try {
      const res = await authorizedFetch('api/user/historydata' + '?items=' + state.paginationMaxElements + '&page=' + state.paginationCurrentPage)
      const data = await res.json()
      return data
    } catch (error) {
      console.log('Failed to fetch history data:', error)
      return []
    }
  }

  useEffect(() => {
    if (!isSignedIn) {
      dispatch({ type: 'SET_HISTORY', payload: [] })
      return
    }

    // Refactor this for update in data structure
    fetchHistoryData()
      .then((data) => {
        if (data.message === 'No token provided!') {
          dispatch({ type: 'SET_HISTORY', payload: [] })
          return
        } else if (data.message === 'No sessions found!') {
          dispatch({ type: 'SET_HISTORY', payload: [] })
          return
        }
        dispatch({ type: 'SET_HISTORY', payload: data.data })
        console.log(data)
        dispatch({ type: 'SET_PAGINATION_DATA', payload: data.pages })
      })
      .catch(() => {
        dispatch({ type: 'SET_HISTORY', payload: [] })
      })
  }, [isSignedIn, state.paginationCurrentPage])

  function handleAddSession () {
    dispatch({ type: 'SHOW_ADD_SESSION' })
  }

  function handleEditSession (data) {
    if (state.showEditSession) {
      dispatch({ type: 'HIDE_EDIT_SESSION' })
      setTimeout(() => {
        dispatch({ type: 'HANDLE_SHOW_EDIT_SESSION', payload: data })
      }, 150)
    } else {
      dispatch({ type: 'HANDLE_SHOW_EDIT_SESSION', payload: data })
    }
  }

  async function handleDeleteSession (id) {
    try {
      const res = await authorizedFetch('api/user/deletesession', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          SessionId: id
        })
      })

      if (res.ok) {
        const response = await res.json()
        if (response.message === 'No sessions found!') {
          dispatch({ type: 'SET_HISTORY', payload: [] })
        } else {
          dispatch({ type: 'SET_HISTORY', payload: response.data })
          console.log(response)
          dispatch({ type: 'SET_PAGINATION_DATA', payload: response.pages })
          dispatch({ type: 'SET_CURRENT_PAGE', payload: 1 })
        }
      }
    } catch (error) {
      console.error('Failed to delete session:', error)
    }
  }

  // Isn't it better to just return the data from API at the success of the edit post?
  const handleEditSessionSuccess = (data) => {
    dispatch({ type: 'HANDLE_EDIT_SESSION_SUCCESS', payload: data })
  }

  const handleOnAddSessionSuccess = async (data) => {
    dispatch({ type: 'HANDLE_ADD_SESSION_SUCCESS', payload: data })
  }

  const handleShowSessionViewer = (data) => {
    if (state.showSessionViewer) {
      dispatch({ type: 'HIDE_SESSION_VIEWER' })
      setTimeout(() => {
        dispatch({ type: 'HANDLE_SHOW_SESSION_VIEWER', payload: data })
      }, 150)
    } else {
      dispatch({ type: 'HANDLE_SHOW_SESSION_VIEWER', payload: data })
    }
  }

  // TODO: [BDOGT-64] Rework styling and UX and UI

  return (
    <>
      {isSignedIn && (
        <div role="historyContainer" className='historyContainer'>
          <div className="sessionAdd">
            <button name="sessionAdd button" onClick={handleAddSession}>
              Add Session
            </button>
          </div>
          {state.showSessionViewer && (
            <SessionViewer session={state.sessionViewerData} onCloseClick={() => dispatch({ type: 'HIDE_SESSION_VIEWER' })} />
          )}
          {state.showAddSession && (
            <AddSession
            onAddSessionSuccess={handleOnAddSessionSuccess}
            authorizedFetch={authorizedFetch}
            onCloseClick={() => dispatch({ type: 'HIDE_ADD_SESSION' })}
            />
          )}
          {state.showEditSession && (
            <EditSession
              data={state.editData}
              onEditSuccess={handleEditSessionSuccess}
              authorizedFetch={authorizedFetch}
              onCloseClick={() => dispatch({ type: 'HIDE_EDIT_SESSION' })}
            />
          )}
          <div className="history-table-container">
            {state.data.length > 0 && (
              <HistoryTable
                onEditTrigger={handleEditSession}
                onDeleteTrigger={handleDeleteSession}
                data={state.data}
                onOpenSessionViewer={(item) => handleShowSessionViewer(item)}
              />
            )}
          </div>
          <div className="pagination">
              {state.paginationPages.map((page) => {
                return (
                  <button key={page} name="paginationButton" onClick={() => dispatch({ type: 'SET_CURRENT_PAGE', payload: page })}>
                    {page}
                  </button>
                )
              }
              )}
            </div>
        </div>
      )}
    </>
  )
}

export default History
