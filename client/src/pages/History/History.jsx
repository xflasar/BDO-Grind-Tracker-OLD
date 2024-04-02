import React, { useContext, useReducer } from 'react'
import HistoryTable from '../../components/ui/pages/History/HistoryTable/HistoryTable'
import EditSession from '../../components/form/EditSession/editSession'
import '../../assets/pages/History/History.scss'
import AddSession from '../../components/form/AddSession/addSession'
import { SessionContext } from '../../contexts/SessionContext'
import { INITIAL_STATE, historyReducer } from './historyReducer'
import SessionViewer from '../../components/ui/pages/History/HistorySessionViewer'

function History () {
  const { authorizedFetch } = useContext(SessionContext)
  const [state, dispatch] = useReducer(historyReducer, INITIAL_STATE)

  const historyTableRef = React.createRef()

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
          historyTableRef.current.handleSetData([])
          historyTableRef.current.handleSetPaginationData([])
          historyTableRef.current.hanldeSetPaginationCurrentPage(1)
        } else {
          historyTableRef.current.handleSetData(response.data)
          historyTableRef.current.handleSetPaginationData(response.paginationData)
          historyTableRef.current.hanldeSetPaginationCurrentPage(1)
        }
      }
    } catch (error) {
      console.error('Failed to delete session:', error)
    }
  }

  // Isn't it better to just return the data from API at the success of the edit post?
  const handleEditSessionSuccess = (data) => {
    console.log(data)
    historyTableRef.current.handleEditSessionDataUpdate(data)
  }

  const handleOnAddSessionSuccess = async (data) => {
    historyTableRef.current.handleAddSessionDataUpdate(data)
    dispatch({ type: 'HIDE_ADD_SESSION' })
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
          <HistoryTable
              authorizedFetch={authorizedFetch}
              onEditTrigger={handleEditSession}
              onDeleteTrigger={handleDeleteSession}
              onOpenSessionViewer={(item) => handleShowSessionViewer(item)}
              ref={historyTableRef}
            />
        </div>
      </div>
    </>
  )
}

export default History
