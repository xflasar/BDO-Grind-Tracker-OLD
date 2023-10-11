import React, { useContext, useEffect, useReducer } from 'react'
import PropTypes from 'prop-types'
import '../../../assets/components/form/addSession.scss'
import { SessionContext } from '../../../contexts/SessionContext'
import { INITIAL_STATE, addSessionReducer } from './addSessionReducer'

const AddSession = ({ onAddSessionSuccess, onCloseClick }) => {
  const { authorizedFetch } = useContext(SessionContext)
  const [state, dispatch] = useReducer(addSessionReducer, INITIAL_STATE)

  useEffect(() => {
    fetchSites()
    fetchLoadouts()
  }, [])

  // This probably can be done more efficient
  useEffect(() => {
    const totalDropRate = Object.values(state.DropRate).reduce((acc, rate) => {
      if (rate.active) acc += rate.dropRate
      return acc
    }, 0)

    const parsedTotalDropRate = totalDropRate === '0.00' ? 0 : parseFloat(totalDropRate)

    dispatch({ type: 'ADD_SESSION_DROP_RATE_TOTAL_CHANGE', payload: parsedTotalDropRate })
  }, [state.DropRate])

  async function handleAddSessionSubmit (e) {
    e.preventDefault()
    const formData = new FormData(e.target)
    const formValues = Object.fromEntries(formData.entries())

    try {
      const res = await authorizedFetch('api/user/addsession', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formValues)
      })
      const data = await res.json()
      onAddSessionSuccess({
        Data: data,
        setAddSession: false
      })
    } catch (error) {
      console.log('Failed to add session:', error)
    }
  }

  const fetchLoadouts = async () => {
    try {
      const response = await authorizedFetch('/api/user/getloadouts')
      const data = await response.json()

      if (data.message === 'No loadouts found!') return dispatch({ type: 'ADD_SESSION_LOADOUTS_FETCH', payload: [] })

      dispatch({ type: 'ADD_SESSION_LOADOUTS_FETCH', payload: data })
    } catch (err) {
      console.error(err)
    }
  }

  const fetchDropItems = async (siteId) => {
    try {
      const response = await authorizedFetch(`/api/user/getaddsessionsitesitemdata/${siteId}`)
      const data = await response.json()
      dispatch({ type: 'ADD_SESSION_DROP_ITEMS_FETCH', payload: data })
    } catch (error) {
      console.log('Failed to fetch drop items:', error)
    }
  }

  // eslint-disable-next-line no-unused-vars
  const fetchSites = async () => {
    const response = await authorizedFetch('/api/user/getaddsessionsites')
    if (response.ok) {
      const res = await response.json()
      dispatch({ type: 'ADD_SESSION_SITES_FETCH', payload: res })
    } else {
      console.log('No data. ' + response.message)
    }
  }

  const handleSiteChoosing = (e, siteId) => {
    e.preventDefault()
    dispatch({ type: 'ADD_SESSION_ACTIVE_SITE', payload: siteId })
    fetchDropItems(siteId)
  }

  const handleSettingsDropRateItem = (itemName) => {
    dispatch({ type: 'ADD_SESSION_INPUT_DROPRATE_CHANGE', payload: itemName })
  }

  const handleAddEditLoadoutDataChange = (e) => {
    dispatch({ type: 'ADD_SESSION_ADDEDITLOADOUT_ONCHANGE_INPUT', payload: { name: e.target.name, value: e.target.value } })
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

  const handleShowEditLoadout = (loadout) => {
    dispatch({ type: 'ADD_SESSION_EDIT_LOADOUT', payload: loadout })
  }

  const handleHideAddEditLoadout = () => {
    dispatch({ type: 'ADD_SESSION_CANCEL_ADD_EDIT_LOADOUT' })
  }

  const handleClose = (e) => {
    e.preventDefault()
    onCloseClick(false)
  }

  return (
    <div className='sessionAddOverlay'>
      <div className='sessionAddOverlay-Content'>
      <form aria-label='sessionAddForm' onSubmit={handleAddSessionSubmit}>
        <button type='button' className='sessionAddOverlay-Content-Close' onClick={handleClose}>X</button>
        <div className='sessionSiteChoosing'>
          <div className='sessionSiteChoosing-Header'>
            <h3>Sites</h3>
          </div>
          <div className='sessionSiteChoosing-SiteList'>
            {state.Sites && (
              Object.values(state.Sites).map((site) => {
                return (<div key={site._id} className='sessionSiteChoosing-SiteList-Item'><label key={site._id} className={state.activeSite === site._id ? 'active' : ''} onClick={(e) => handleSiteChoosing(e, site._id)}>{site.SiteName}</label></div>)
              })
            )}
          </div>
        </div>
        <div className='sessionMainContent'>
        <div className='sessionMainContent-HeaderContent'>
            <div className='sessionMainContent-HeaderContent-SessionTime'>
              <h3>Session Time</h3>
              <div className='sessionMainContent-HeaderContent-SessionTime-Content'>
                <h3>0h</h3>
                <h3>|</h3>
                <h3>0m</h3>
              </div>
            </div>
            <div className='sessionMainContent-HeaderContent-TotalSilverAfterTaxes'>
              <h3>Total Silver After Taxes</h3>
              <div className='sessionMainContent-HeaderContent-TotalSilverAfterTaxes-Content'>
                <h3>0</h3>
              </div>
            </div>
            <div className='sessionMainContent-HeaderContent-SilverPreHourBeforeTaxes'>
              <h3>Silver Pre Hour Before Taxes</h3>
              <div className='sessionMainContent-HeaderContent-SilverPreHourBeforeTaxes-Content'>
                <h3>0</h3>
              </div>
            </div>
            <div className='sessionMainContent-HeaderContent-SilverPreHourAfterTaxes'>
              <h3>Silver Pre Hour After Taxes</h3>
              <div className='sessionMainContent-HeaderContent-SilverPreHourAfterTaxes-Content'>
                <h3>0</h3>
              </div>
            </div>
          </div>
          <div className='sessionMainContent-SetupContent'>
            <div className='sessionMainContent-SetupContent-Items'>
              <h2>Items</h2>
              {state.DropItems.length > 0
                ? (
                <div className='sessionMainContent-SetupContent-Items-Content'>
                    {Object.values(state.DropItems).map((item, index) => {
                      return (<div key={item.itemId ? item.itemId : index} className='sessionMainContent-SetupContent-Items-Content-Item'>
                        <label htmlFor={item.itemId ? item.itemId : index}>{item.itemName}</label>
                        <input type='text' name={item.itemId ? item.itemId : index} placeholder='0'/>
                        </div>)
                    })}
                </div>
                  )
                : (<div style={{ textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', fontSize: '2rem', color: '#ffa600' }}><p>Select Site From Left List!</p></div>)}
            </div>
            <div className='sessionMainContent-SetupContent-Gear'>
              <h2>Gear</h2>
              {state.activeSite
                ? (
                <div className='sessionMainContent-SetupContent-Gear-Content'>
                  <div className='sessionMainContent-SetupContent-Gear-Content-List'>
                    {state.Loadouts.length > 0
                      ? (
                          state.Loadouts.map((loadout) => {
                            return (<div key={loadout.id} className='sessionMainContent-SetupContent-Gear-Content-List-Item'>
                            <h3>{loadout.name}</h3>
                            <h4>
                              Class: <span>{loadout.class}</span>
                            </h4>

                            <div className='sessionMainContent-SetupContent-Gear-Content-List-Item-Content'>
                              <div className='sessionMainContent-SetupContent-Gear-Content-List-Item-Content-AP'>
                                <span>AP</span><br/>
                                <span>{loadout.AP}</span>
                              </div>
                              <div className='sessionMainContent-SetupContent-Gear-Content-List-Item-Content-DP'>
                                <span>DP</span><br/>
                                <span>{loadout.DP}</span>
                              </div>
                            </div>
                            <button type='button' onClick={() => handleRemoveLoadout(loadout.id)}>X</button>
                            <button type='button' onClick={() => handleShowEditLoadout(loadout)}>Edit</button>
                          </div>)
                          })
                        )
                      : null
                      }
                      <div className='sessionMainContent-SetupContent-Gear-Content-List-AddLoadout'>
                        {state.AddLoadout || state.EditLoadout
                          ? (
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <label htmlFor='LoadoutName'>Loadout Name:</label>
                            <input type='text' name='name' id='LoadoutName' placeholder='Loadout Name' onChange={(e) => handleAddEditLoadoutDataChange(e)} value={state.AddEditLoadoutData.name}/>
                            <label htmlFor='Class'>Class:</label>
                            <input type='text' name='class' id='Class'placeholder='Class Name (e.g. Striker)' onChange={(e) => handleAddEditLoadoutDataChange(e)} value={state.AddEditLoadoutData.class}/>
                            <label htmlFor='AP'>AP:</label>
                            <input type='text' name='AP' id='AP' placeholder='AP' onChange={(e) => handleAddEditLoadoutDataChange(e)} value={state.AddEditLoadoutData.AP}/>
                            <label htmlFor='DP'>DP:</label>
                            <input type='text' name='DP' id='DP' placeholder='DP' onChange={(e) => handleAddEditLoadoutDataChange(e)} value={state.AddEditLoadoutData.DP}/>
                            {state.AddLoadout && (
                            <button type='button' onClick={() => handleAddLoadout()}>Add Loadout</button>
                            )}
                            {state.EditLoadout && (
                            <button type='button' onClick={() => handleEditLoadout(state.AddEditLoadoutData.id)}>Edit Loadout</button>)}
                            <button type='button' onClick={() => handleHideAddEditLoadout()}>Cancel</button>
                          </div>
                            )
                          : <button type='button' onClick={() => dispatch({ type: 'ADD_SESSION_ADD_LOADOUT' })}>Add Loadout</button>}
                      </div>
                  </div>
                </div>
                  )
                : (<div style={{ textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', fontSize: '2rem', color: '#ffa600' }}><p>Select Site From Left List!</p></div>)}
            </div>
            <div className='sessionMainContent-SetupContent-Settings'>
              <h2>Settings</h2>
              {state.activeSite
                ? (
                <div className='sessionMainContent-SetupContent-Settings-Content'>
                  <div className='sessionMainContent-SetupContent-Settings-Content-GridList'>
                    {state.DropRate && (
                      Object.keys(state.DropRate).map((itemName) => {
                        return (
                        <div key={itemName} className={state.DropRate[itemName].active ? 'sessionMainContent-SetupContent-Settings-Content-GridList-Item active' : 'sessionMainContent-SetupContent-Settings-Content-GridList-Item'} onClick={() => handleSettingsDropRateItem(itemName)}>
                          <img src={state.DropRate[itemName].icon}/>
                        </div>
                        )
                      })
                    )}
                  </div>
                  <div className='sessionMainContent-SetupContent-Settings-Content-Total'>
                    <h3>Total Drop Rate:</h3>
                    <h3>{(state.DropRateTotal * 100).toFixed(0)}%</h3>
                  </div>
                </div>
                  )
                : (<div style={{ textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', fontSize: '2rem', color: '#ffa600' }}><p>Select Site From Left List!</p></div>)}
            </div>
          </div>
        </div>
      </form>
      </div>
    </div>
  )
}

AddSession.propTypes = {
  onAddSessionSuccess: PropTypes.func.isRequired,
  onCloseClick: PropTypes.func.isRequired
}

export default AddSession
