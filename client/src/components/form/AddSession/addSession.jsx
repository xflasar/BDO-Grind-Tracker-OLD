import React, { useContext, useEffect, useReducer } from 'react'
import PropTypes from 'prop-types'
import '../../../assets/components/form/addSession.scss'
import { SessionContext } from '../../../contexts/SessionContext'
import { addSessionReducerINIT, addSessionReducer } from './addSessionReducer'
import AddSessionSettings from './settings'
import { settingsReducerINIT, settingsReducer } from './settings.reducer'
import Loadout from './loadout'
import { loadoutReducerINIT, loadoutReducer } from './loadout.reducer'
import DropItems from './dropItems'
import { dropItemReducerINIT, dropItemReducer } from './dropItems.reducer'

const AddSession = ({ onAddSessionSuccess, onCloseClick }) => {
  const { authorizedFetch } = useContext(SessionContext)
  const [state, dispatch] = useReducer(addSessionReducer, addSessionReducerINIT)
  const [settingsState, settingsDispatch] = useReducer(settingsReducer, settingsReducerINIT)
  const [loadoutState, loadoutDispatch] = useReducer(loadoutReducer, loadoutReducerINIT)
  const [dropItemState, dropItemDispatch] = useReducer(dropItemReducer, dropItemReducerINIT)

  useEffect(() => {
    // Merge these fetches into one that calls 1 API endpoint
    fetchSites()
    getTax()
  }, [])

  const getTax = async () => {
    const dataTax = await authorizedFetch('/api/user/gettax')
    if (!dataTax.ok) {
      console.log('Failed to fetch tax')
      return
    }
    const data = await dataTax.json()

    console.log('Tax fetched: ' + data.tax)
    dispatch({ type: 'ADD_SESSION_SET_TAX', payload: data.tax })
  }

  async function handleAddSessionSubmit (e) {
    e.preventDefault()

    const sessionData = state.SessionData
    sessionData.DropRate = state.DropRate
    sessionData.DropItems = state.DropItems
    sessionData.sessionTime = state.sessionTimeHours + '' + state.sessionTimeMinutes

    sessionData.DropItems.map((item) => {
      if (item.amount) return item
      item.amount = 0
      return item
    })

    try {
      const res = await authorizedFetch('api/user/addsession', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(sessionData)
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
  }

  const handleSessionTimeChange = (e) => {
    dispatch({ type: 'ADD_SESSION_INPUT_SESSIONTIME_CHANGE', payload: { name: e.target.name, value: e.target.value } })
  }

  // Recalculating silver after every change to sessionTime
  useEffect(() => {
    if (!state.activeSite || !dropItemState.DropItems) return

    const newState = recalculateSilverPerHour(state, dropItemState.DropItems)
    dispatch({ type: 'ADD_SESSION_RECALCULATE_SILVER_CHANGE', payload: newState })
  }, [state.sessionTimeHours, state.sessionTimeMinutes])

  const handleDropItemChange = (dropItems) => {
    const newState = recalculateSilverPerHour(state, dropItems)
    dispatch({ type: 'ADD_SESSION_RECALCULATE_SILVER_CHANGE', payload: newState })
  }

  // Closes the form and clears the state
  const handleClose = (e) => {
    e.preventDefault()
    dispatch({ type: 'ADD_SESSION_CLEAR_STATE' })
    onCloseClick(false)
  }

  // Helpers functions
  function formatNumberWithSpaces (number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }

  const recalculateSilverPerHour = (state, DropItems) => {
    if (DropItems.length === 0) DropItems = state.DropItems

    const totalSilverBeforeTaxes = DropItems.reduce((acc, item) => {
      const itemPrice = Number(item.itemPrice)
      const amount = Number(item.amount)

      if (isNaN(itemPrice) || isNaN(amount)) return acc

      // fixme: Math.abs useless change api to return positive number
      const product = item.validMarketplace ? ((itemPrice * amount) - ((itemPrice * amount) * Math.abs(state.tax))) : (itemPrice * amount)

      return acc + product
    }, 0)

    const sessionTime = (Number(state.sessionTimeHours) * 60) + Number(state.sessionTimeMinutes)

    let totalSilverAfterTaxes = 0
    let silverPerHourBeforeTaxes = 0
    let silverPerHourAfterTaxes = 0

    if (sessionTime !== 0) {
      totalSilverAfterTaxes = totalSilverBeforeTaxes
      silverPerHourBeforeTaxes = Math.round(totalSilverBeforeTaxes / (sessionTime / 60))
      silverPerHourAfterTaxes = Math.round(totalSilverAfterTaxes / (sessionTime / 60))
    }

    const newState = {
      ...state,
      totalSilverAfterTaxes,
      silverPerHourBeforeTaxes,
      silverPerHourAfterTaxes
    }

    return newState
  }

  // Render functions
  function renderHeader () {
    return (
      <>
        <div className="sessionMainContent-HeaderContent-SessionTime">
          <h3>Session Time</h3>
          <div className="sessionMainContent-HeaderContent-SessionTime-Content">
            <input
              type="text"
              name="sessionTimeHours"
              onChange={(e) => handleSessionTimeChange(e)}
              value={state.sessionTimeHours}
              placeholder="0h"
            />
            <h3>|</h3>
            <input
              type="text"
              name="sessionTimeMinutes"
              onChange={(e) => handleSessionTimeChange(e)}
              value={state.sessionTimeMinutes}
              placeholder="0m"
            />
          </div>
        </div>
        <div className="sessionMainContent-HeaderContent-TotalSilverAfterTaxes">
          <h3>Total Silver After Taxes</h3>
          <div className="sessionMainContent-HeaderContent-TotalSilverAfterTaxes-Content">
            <h3>{formatNumberWithSpaces(state.totalSilverAfterTaxes)}</h3>
          </div>
        </div>
        <div className="sessionMainContent-HeaderContent-SilverPreHourBeforeTaxes">
          <h3>Silver Per Hour Before Taxes</h3>
          <div className="sessionMainContent-HeaderContent-SilverPreHourBeforeTaxes-Content">
            <h3>{formatNumberWithSpaces(state.silverPerHourBeforeTaxes)}</h3>
          </div>
        </div>
        <div className="sessionMainContent-HeaderContent-SilverPreHourAfterTaxes">
          <h3>Silver Per Hour After Taxes</h3>
          <div className="sessionMainContent-HeaderContent-SilverPreHourAfterTaxes-Content">
            <h3>{formatNumberWithSpaces(state.silverPerHourAfterTaxes)}</h3>
          </div>
        </div>
      </>
    )
  }

  function renderDropItems () {
    if (state.activeSite) {
      return (
        <DropItems state={dropItemState} dispatch={dropItemDispatch} authorizedFetch={authorizedFetch} siteId={state.activeSite} handleDropItemsAmountChange={handleDropItemChange} />
      )
    }
  }

  function renderLoadout () {
    if (state.activeSite) {
      return (
        <Loadout state={loadoutState} dispatch={loadoutDispatch} authorizedFetch={authorizedFetch} />
      )
    } else {
      return <div style={{ textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', fontSize: '2rem', color: '#ffa600' }}><p>Select Site From Site List!</p></div>
    }
  }

  function renderSettings () {
    if (state.activeSite) {
      return (
        <AddSessionSettings state={settingsState} dispatch={settingsDispatch} handleDropItemsAmountChange={(dropItems) => handleDropItemChange(dropItems)} />
      )
    } else {
      return <div style={{ textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', fontSize: '2rem', color: '#ffa600' }}><p>Select Site From Site List!</p></div>
    }
  }

  return (
    <div className='sessionAddOverlay'>
      <div className={state.activeSite !== '' ? 'sessionAddOverlay-Content' : 'sessionAddOverlay-Content partial'}>
      <form aria-label='sessionAddForm' onSubmit={handleAddSessionSubmit}>
        <button type='button' className='sessionAddOverlay-Content-Close' onClick={handleClose}>X</button>
        <div className='sessionSiteChoosing'>
          <div className='sessionSiteChoosing-Header'>
            <h3>Sites</h3>
          </div>
          <div className={state.activeSite !== '' ? 'sessionSiteChoosing-SiteList disabled' : 'sessionSiteChoosing-SiteList'}>
            {state.Sites && (
              Object.values(state.Sites).map((site) => {
                return (<div key={site._id} className={state.activeSite === site._id ? 'sessionSiteChoosing-SiteList-Item active' : 'sessionSiteChoosing-SiteList-Item'} onClick={(e) => handleSiteChoosing(e, site._id)}><label>{site.SiteName}</label></div>)
              })
            )}
          </div>
        </div>

        <div className='sessionMainContent'>
          <div className='sessionMainContent-HeaderContent'>
          {renderHeader()}
          </div>
          <div className='sessionMainContent-SetupContent'>
            <div className='sessionMainContent-SetupContent-Items'>
              <h2>Items</h2>
              {renderDropItems()}
            </div>
            <div className='sessionMainContent-SetupContent-Gear'>
              <h2>Gear</h2>
              {renderLoadout()}
            </div>
            <div className='sessionMainContent-SetupContent-Settings'>
              <h2>Settings</h2>
              {renderSettings()}
            </div>
            <div className='sessionMainContent-SetupContent-BackSubmit'>
              <button type='button' onClick={() => dispatch({ type: 'ADD_SESSION_CLEAR_ACTIVE_SITE' })}>Change Site</button>
              <button type='submit'>Add Session</button>
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
