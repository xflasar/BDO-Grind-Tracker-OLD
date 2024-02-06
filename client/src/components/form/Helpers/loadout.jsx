import React, { useEffect } from 'react'
import PropTypes from 'prop-types'

const Loadout = ({ state, dispatch, authorizedFetch }) => {
  useEffect(() => {
    fetchLoadouts()
  }, [])

  const fetchLoadouts = async () => {
    try {
      const response = await authorizedFetch('/api/user/getloadouts')
      const data = await response.json()

      if (data.message === 'No loadouts found!') { return dispatch({ type: 'ADD_SESSION_LOADOUTS_FETCH', payload: [] }) }

      dispatch({ type: 'ADD_SESSION_LOADOUTS_FETCH', payload: data })
    } catch (err) {
      console.error(err)
    }
  }

  const handleAddEditLoadoutDataChange = (e) => {
    dispatch({
      type: 'ADD_SESSION_ADDEDITLOADOUT_ONCHANGE_INPUT',
      payload: { name: e.target.name, value: e.target.value }
    })
  }

  const handleAddLoadout = async () => {
    const response = await authorizedFetch('/api/user/addloadout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        loadoutName: state.AddEditLoadoutData.name,
        loadoutClass: state.AddEditLoadoutData.class,
        loadoutAP: state.AddEditLoadoutData.AP,
        loadoutDP: state.AddEditLoadoutData.DP
      })
    })
    if (response.ok) {
      const res = await response.json()
      dispatch({ type: 'ADD_SESSION_SUCCESSFULL_ADD_LOADOUT', payload: res })
    }
  }

  const handleRemoveLoadout = async (id) => {
    try {
      const response = await authorizedFetch('/api/user/deleteloadout', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          loadoutId: id
        })
      })

      const data = await response.json()
      dispatch({ type: 'ADD_SESSION_LOADOUTS_FETCH', payload: data })
    } catch (error) {
      console.log('Failed to remove loadout:', error)
    }
  }

  const handleEditLoadout = async (id) => {
    try {
      const response = await authorizedFetch('/api/user/updateloadout', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          loadoutId: id,
          loadoutName: state.AddEditLoadoutData.name,
          loadoutClass: state.AddEditLoadoutData.class,
          loadoutAP: state.AddEditLoadoutData.AP,
          loadoutDP: state.AddEditLoadoutData.DP
        })
      })
      const data = await response.json()
      dispatch({ type: 'ADD_SESSION_SUCCESSFULL_EDIT_LOADOUT', payload: data })
    } catch (error) {
      console.log('Failed to edit loadout:', error)
    }
  }

  const handleSelectLoadout = (loadoutId) => {
    dispatch({ type: 'ADD_SESSION_SELECT_LOADOUT', payload: loadoutId })
  }

  const handleClearSelectedLoadout = () => {
    dispatch({ type: 'ADD_SESSION_CLEAR_SELECTED_LOADOUT' })
  }

  const handleShowEditLoadout = (e, loadout) => {
    e.preventDefault()
    dispatch({ type: 'ADD_SESSION_EDIT_LOADOUT', payload: loadout })
  }

  const handleHideAddEditLoadout = () => {
    dispatch({ type: 'ADD_SESSION_CANCEL_ADD_EDIT_LOADOUT' })
  }

  // Render functions
  function renderList (loadout) {
    return (
      <div
        key={loadout.id}
        className={
          state.selectedLoadoutId === loadout.id
            ? 'sessionMainContent-SetupContent-Gear-Content-List-Item active'
            : 'sessionMainContent-SetupContent-Gear-Content-List-Item'
        }
      >
        <div className='sessionMainContent-SetupContent-Gear-Content-List-Item-ClickArea' onClick={(state.selectedLoadoutId && state.selectedLoadoutId === loadout.id) ? () => handleClearSelectedLoadout() : () => handleSelectLoadout(loadout.id)}></div>
        <h3>{loadout.name}</h3>
        <h4>
          Class: <span>{loadout.class}</span>
        </h4>
        <div className="sessionMainContent-SetupContent-Gear-Content-List-Item-Content">
          <div className="sessionMainContent-SetupContent-Gear-Content-List-Item-Content-AP">
            <span>AP</span>
            <br />
            <span>{loadout.AP}</span>
          </div>
          <div className="sessionMainContent-SetupContent-Gear-Content-List-Item-Content-DP">
            <span>DP</span>
            <br />
            <span>{loadout.DP}</span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => handleRemoveLoadout(loadout.id)}
        >
          X
        </button>
        <button
          type="button"
          onClick={(e) => handleShowEditLoadout(e, loadout)}
        >
          Edit
        </button>
      </div>
    )
  }

  function renderAddLoadout () {
    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label htmlFor="LoadoutName">Loadout Name:</label>
              <input
                type="text"
                name="name"
                id="LoadoutName"
                placeholder="Loadout Name"
                onChange={(e) => handleAddEditLoadoutDataChange(e)}
                value={state.AddEditLoadoutData.name}
              />
              <label htmlFor="Class">Class:</label>
              <input
                type="text"
                name="class"
                id="Class"
                placeholder="Class Name (e.g. Striker)"
                onChange={(e) => handleAddEditLoadoutDataChange(e)}
                value={state.AddEditLoadoutData.class}
              />
              <label htmlFor="AP">AP:</label>
              <input
                type="text"
                name="AP"
                id="AP"
                placeholder="AP"
                onChange={(e) => handleAddEditLoadoutDataChange(e)}
                value={state.AddEditLoadoutData.AP}
              />
              <label htmlFor="DP">DP:</label>
              <input
                type="text"
                name="DP"
                id="DP"
                placeholder="DP"
                onChange={(e) => handleAddEditLoadoutDataChange(e)}
                value={state.AddEditLoadoutData.DP}
              />
              {state.AddLoadout && (
                <button type="button" onClick={() => handleAddLoadout()}>
                  Add Loadout
                </button>
              )}
              {state.EditLoadout && (
                <button
                  type="button"
                  onClick={() => handleEditLoadout(state.AddEditLoadoutData.id)}
                >
                  Edit Loadout
                </button>
              )}
              <button type="button" onClick={() => handleHideAddEditLoadout()}>
                Cancel
              </button>
            </div>
    )
  }

  return (
    <div className="sessionMainContent-SetupContent-Gear-Content">
      <div className="sessionMainContent-SetupContent-Gear-Content-List">
        {state.Loadouts
          ? state.Loadouts.map((loadout) => {
            return renderList(loadout)
          })
          : null}
        <div className="sessionMainContent-SetupContent-Gear-Content-List-AddLoadout">
          {(state.AddLoadout || state.EditLoadou) && renderAddLoadout()}
            {!state.AddLoadout && (
              <button
                type="button"
                onClick={() => dispatch({ type: 'ADD_SESSION_ADD_LOADOUT' })}
              >
                Add Loadout
              </button>
            )}
        </div>
      </div>
    </div>
  )
}

Loadout.propTypes = {
  state: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  authorizedFetch: PropTypes.func.isRequired
}

export default Loadout
