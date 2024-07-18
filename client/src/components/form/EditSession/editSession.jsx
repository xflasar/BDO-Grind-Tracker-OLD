import React, { useEffect, useReducer } from 'react'
import PropTypes from 'prop-types'
import '../../../assets/components/form/editSession.scss'
import { settingsReducer, settingsReducerINIT } from '../Helpers/settings.reducer'
import Settings from '../Helpers/settings'
import { loadoutReducer, loadoutReducerINIT } from '../Helpers/loadout.reducer'

import Loadout from '../Helpers/loadout'
import { dropItemReducer, dropItemReducerINIT } from '../Helpers/dropItems.reducer'
import DropItems from '../Helpers/dropItems'
import { INITIAL_STATE, editSessionReducer } from './editSessionReducer'
import { handleDropItemChange, formatNumberWithSpaces, handleSessionTimeChange, recalculateSilverPerHour } from '../Helpers/sessionModify.helper'

const EditSession = ({ data, onEditSuccess, authorizedFetch, onCloseClick }) => {
  const [state, dispatch] = useReducer(editSessionReducer, INITIAL_STATE)
  const [settingsState, settingsDispatch] = useReducer(settingsReducer, settingsReducerINIT)
  const [loadoutState, loadoutDispatch] = useReducer(loadoutReducer, loadoutReducerINIT)
  const [dropItemState, dropItemDispatch] = useReducer(dropItemReducer, dropItemReducerINIT)

  if (!data) {
    return null
  }

  async function handleEditSessionSubmit (data) {
    try {
      const res = await authorizedFetch('api/user/sessions/editsession', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      const dataRes = await res.json()
      if (dataRes.error) {
        console.log(dataRes.error)
        return false
      } else {
        // FIXME:After successful edit the data in history data array won't reflect (modify) the edited data
        onEditSuccess(dataRes)
        return true
      }
    } catch (error) {
      console.error('Failed to edit session:', error)
      return false
    }
  }

  useEffect(() => {
    dispatch({ type: 'EDIT_SESSION_SET_DATA', payload: data })
    settingsDispatch({ type: 'ADD_SESSION_DROP_RATE_SET', payload: data.SettingsDropRate })
    loadoutDispatch({ type: 'ADD_SESSION_SELECT_LOADOUT', payload: data.Loadout._id })
    dropItemDispatch({ type: 'ADD_SESSION_DROP_ITEMS_FETCH', payload: data.DropItems })
  }, [])

  useEffect(() => {
    if (!state.activeSite || !dropItemState.DropItems) return

    const newState = recalculateSilverPerHour(state, dropItemState.DropItems)
    dispatch({ type: 'ADD_SESSION_RECALCULATE_SILVER_CHANGE', payload: newState })
  }, [state.sessionTimeHours, state.sessionTimeMinutes])

  // Fix this
  const handleAddSessionSubmit = async (e) => {
    e.preventDefault()

    const newSession = {
      _id: data._id,
      originalSessionTime: (Number(state.sessionTimeHours) * 60) + Number(state.sessionTimeMinutes),
      sessionTime: (Number(state.sessionTimeHours) * 60) + Number(state.sessionTimeMinutes),
      Agris: Number(state.Agris),
      AgrisTotal: Number(state.AgrisTotal),
      totalSilverAfterTaxes: Number(state.totalSilverAfterTaxes),
      silverPerHourBeforeTaxes: Number(state.silverPerHourBeforeTaxes),
      silverPerHourAfterTaxes: Number(state.silverPerHourAfterTaxes),
      originalTotalSilverAfterTaxes: Number(state.originalTotalSilverAfterTaxes),
      originalSilverPerHourBeforeTaxes: Number(state.originalSilverPerHourBeforeTaxes),
      originalSilverPerHourAfterTaxes: Number(state.originalSilverPerHourAfterTaxes),
      SettingsDropRate: {
        DropRate: settingsState.DropRate,
        EcologyDropRate: settingsState.ecologyDropRate,
        NodeLevel: settingsState.nodeLevel,
        DropRateTotal: settingsState.DropRateTotal
      },
      DropItems: dropItemState.DropItems,
      Loadout: loadoutState.selectedLoadoutId // change this to get whole loadout or actually we can do this in Backend
    }

    const res = await handleEditSessionSubmit(newSession)

    if (res) {
      dispatch({ type: 'EDIT_SESSION_SET_SESSION_STATE', payload: { state: true, stateMsg: 'Session edited!' } })
    } else {
      dispatch({ type: 'EDIT_SESSION_SET_SESSION_STATE', payload: { state: false, stateMsg: 'Failed to edit session!' } })
    }
  }

  const handleClose = (e) => {
    e.preventDefault()
    onCloseClick(false)
  }

  // Methods hanlers

  // #region Render
  function renderHeader () {
    return (
      <>
        <div className="sessionMainContent-HeaderContent-SiteName">
          <h3>Site Name</h3>
          <div className="sessionMainContent-HeaderContent-SiteName-Content">
            <h3>{state.siteName}</h3>
          </div>
        </div>
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
            <h3>|</h3>
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
    return (<DropItems state={dropItemState} dispatch={dropItemDispatch} authorizedFetch={authorizedFetch} siteId={state.siteId} handleDropItemsAmountChange={() => handleDropItemChange(dropItemState.DropItems, state, dispatch)} reload={state.reload}/>)
  }

  function renderLoadout () {
    return (<Loadout state={loadoutState} dispatch={loadoutDispatch} authorizedFetch={authorizedFetch} />)
  }

  function renderSettings () {
    return (<Settings state={settingsState} dispatch={settingsDispatch} handleDropItemsAmountChange={() => handleDropItemChange(dropItemState.DropItems, state, dispatch)} />)
  }
  // #endregion
  return (
    <div className='sessionEditOverlay'>
      <div className='sessionEditOverlay-Content'>
      <form aria-label='sessionEditForm' onSubmit={handleAddSessionSubmit}>
        <button type='button' aria-label='sessionEditExitButton' className='close' onClick={handleClose}>
          X
        </button>
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
              <button type='submit'>Edit</button>
            </div>
          </div>
          </div>
      </form>
      </div>
    </div>
  )
}

EditSession.propTypes = {
  onEditSuccess: PropTypes.func.isRequired,
  authorizedFetch: PropTypes.func.isRequired,
  onCloseClick: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired
}

export default EditSession
