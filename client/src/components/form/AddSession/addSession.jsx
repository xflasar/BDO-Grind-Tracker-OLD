import React, { useContext, useEffect, useReducer } from 'react'
import PropTypes from 'prop-types'
import '../../../assets/components/form/addSession.scss'
import { SessionContext } from '../../../contexts/SessionContext'
import { addSessionReducerINIT, addSessionReducer } from './addSessionReducer'
import AddSessionSettings from '../Helpers/settings'
import { settingsReducerINIT, settingsReducer } from '../Helpers/settings.reducer'
import Loadout from '../Helpers/loadout'
import { loadoutReducerINIT, loadoutReducer } from '../Helpers/loadout.reducer'
import DropItems from '../Helpers/dropItems'
import { dropItemReducerINIT, dropItemReducer } from '../Helpers/dropItems.reducer'
import { recalculateSilverPerHour, handleDropItemChange, formatNumberWithSpaces, handleSessionTimeChange } from '../Helpers/sessionModify.helper'

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

    const sessionData = {
      Site: state.activeSite,
      sessionTime: (Number(state.sessionTimeHours) * 60) + Number(state.sessionTimeMinutes),
      Agris: state.Agris,
      AgrisTotal: state.AgrisTotal,
      totalSilverAfterTaxes: state.totalSilverAfterTaxes,
      silverPerHourBeforeTaxes: state.silverPerHourBeforeTaxes,
      silverPerHourAfterTaxes: state.silverPerHourAfterTaxes,
      tax: state.tax,
      SettingsDropRate: {
        DropRate: settingsState.DropRate,
        EcologyDropRate: settingsState.ecologyDropRate,
        NodeLevel: settingsState.nodeLevel,
        DropRateTotal: settingsState.DropRateTotal
      },
      DropItems: dropItemState.DropItems,
      Loadout: loadoutState.selectedLoadoutId
    }

    // Used to check for empty drop items, this probably will be checked for unreasonable item amount
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

      onAddSessionSuccess(data)
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

    if (state.activeSite) {
      handleChangeSite()
    }

    dispatch({ type: 'ADD_SESSION_ACTIVE_SITE', payload: siteId })
  }

  // Recalculating silver after every change to sessionTime
  useEffect(() => {
    if (!state.activeSite || !dropItemState.DropItems) return

    const newState = recalculateSilverPerHour(state, dropItemState.DropItems)
    dispatch({ type: 'ADD_SESSION_RECALCULATE_SILVER_CHANGE', payload: newState })
  }, [state.sessionTimeHours, state.sessionTimeMinutes])

  // Closes the form and clears the state
  const handleClose = (e) => {
    e.preventDefault()
    dispatch({ type: 'ADD_SESSION_CLEAR_STATE' })
    onCloseClick(false)
  }

  const handleChangeSite = () => {
    dispatch({ type: 'ADD_SESSION_CLEAR_ACTIVE_SITE' })
    dropItemDispatch({ type: 'ADD_SESSION_DROP_ITEM_CLEAR_DATA' })
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
              onChange={(e) => handleSessionTimeChange(e, dispatch)}
              value={state.sessionTimeHours}
              placeholder="0h"
            />
            <span>|</span>
            <input
              type="text"
              name="sessionTimeMinutes"
              onChange={(e) => handleSessionTimeChange(e, dispatch)}
              value={state.sessionTimeMinutes}
              placeholder="0m"
            />
          </div>
        </div>
        <div className="sessionMainContent-HeaderContent-TotalSilverAfterTaxes">
          <h3>Total Silver After Taxes</h3>
          <div className="sessionMainContent-HeaderContent-TotalSilverAfterTaxes-Content">
            <span>{formatNumberWithSpaces(state.totalSilverAfterTaxes)}</span>
          </div>
        </div>
        <div className="sessionMainContent-HeaderContent-SilverPreHourBeforeTaxes">
          <h3>Silver Per Hour Before Taxes</h3>
          <div className="sessionMainContent-HeaderContent-SilverPreHourBeforeTaxes-Content">
            <span>{formatNumberWithSpaces(state.silverPerHourBeforeTaxes)}</span>
          </div>
        </div>
        <div className="sessionMainContent-HeaderContent-SilverPreHourAfterTaxes">
          <h3>Silver Per Hour After Taxes</h3>
          <div className="sessionMainContent-HeaderContent-SilverPreHourAfterTaxes-Content">
            <span>{formatNumberWithSpaces(state.silverPerHourAfterTaxes)}</span>
          </div>
        </div>
      </>
    )
  }

  function renderDropItems () {
    if (!state.activeSite) return
    return (
        <DropItems state={dropItemState} dispatch={dropItemDispatch} authorizedFetch={authorizedFetch} siteId={state.activeSite} handleDropItemsAmountChange={() => handleDropItemChange(dropItemState.DropItems, state, dispatch)} reload={state.reload}/>
    )
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
          <div className={state.activeSite !== '' ? 'sessionSiteChoosing-SiteList selectedSite' : 'sessionSiteChoosing-SiteList'}>
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
              {renderSettings()}
            </div>
            <div className='sessionMainContent-SetupContent-BackSubmit'>
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
