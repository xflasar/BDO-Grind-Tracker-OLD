import React, { useEffect, useReducer } from 'react'
import PropTypes from 'prop-types'
import '../../../assets/components/form/editSession.scss'
import { INITIAL_STATE, editSessionReducer } from './editSessionReducer'

const EditSession = ({ data, onEditSuccess, authorizedFetch, onCloseClick }) => {
  const [state, dispatch] = useReducer(editSessionReducer, INITIAL_STATE)
  if (!data) {
    return null
  }

  async function handleEditSessionSubmit (data) {
    try {
      const res = await authorizedFetch('api/user/modifysession', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      const dataRes = await res.json()
      if (dataRes.error) {
        console.log(dataRes.error)
      } else {
        onEditSuccess(dataRes)
      }
    } catch (error) {
      console.error('Failed to edit session:', error)
    }
  }

  useEffect(() => {
    dispatch({ type: 'EDIT_SESSION_SET_DATA', payload: data })
  }, [])

  const handleAddSessionSubmit = async (e) => {
    e.preventDefault()
    const Date = (() => {
      const dateParts = state.date.split('-')
      const day = dateParts[2]
      const month = dateParts[1]
      const year = dateParts[0]
      const formattedDate = `${day}/${month}/${year}`
      return formattedDate
    })()
    const SiteName = state.siteName
    const TimeSpent = parseInt(state.timeSpent)
    const TotalEarned = parseInt(state.earnings)
    const AverageEarnings = parseInt(state.averageEarnings)
    const TotalSpent = parseInt(state.expenses)
    const Gear = {
      TotalAP: parseInt(state.gear.TotalAP),
      TotalDP: parseInt(state.gear.TotalDP)
    }

    const newSession = {
      SessionId: state.sessionId,
      Date,
      SiteName,
      TimeSpent,
      TotalEarned,
      AverageEarnings,
      TotalSpent,
      Gear
    }
    await handleEditSessionSubmit(newSession)
  }

  const handleDateChange = (e) => {
    dispatch({ type: 'EDIT_SESSION_INPUT_CHANGE', payload: { name: e.target.name, value: e.target.value } })
  }

  const handleSiteNameChange = (e) => {
    dispatch({ type: 'EDIT_SESSION_INPUT_CHANGE', payload: { name: e.target.name, value: e.target.value } })
  }

  const handleTimeSpentChange = (e) => {
    const pattern = new RegExp(e.target.pattern)
    const validity = pattern.test(e.target.value) && pattern.test(e.target.value)
    if (validity) dispatch({ type: 'EDIT_SESSION_INPUT_CHANGE', payload: { name: e.target.name, value: e.target.value } })
  }

  const handleEarningsChange = (e) => {
    const pattern = new RegExp(e.target.pattern)
    const validity = pattern.test(e.target.value) && pattern.test(e.target.value)
    if (validity) dispatch({ type: 'EDIT_SESSION_INPUT_CHANGE', payload: { name: e.target.name, value: e.target.value } })
  }

  const handleAverageEarningsChange = (e) => {
    const pattern = new RegExp(e.target.pattern)
    const validity = pattern.test(e.target.value) && pattern.test(e.target.value)
    if (validity) dispatch({ type: 'EDIT_SESSION_INPUT_CHANGE', payload: { name: e.target.name, value: e.target.value } })
  }

  const handleExpensesChange = (e) => {
    const pattern = new RegExp(e.target.pattern)
    const validity = pattern.test(e.target.value) && pattern.test(e.target.value)
    if (validity) dispatch({ type: 'EDIT_SESSION_INPUT_CHANGE', payload: { name: e.target.name, value: e.target.value } })
  }

  const handleGearAPChange = (e) => {
    const pattern = new RegExp(e.target.pattern)
    const validity = pattern.test(e.target.value) && pattern.test(e.target.value)
    if (validity) dispatch({ type: 'EDIT_SESSION_INPUT_CHANGE', payload: { name: e.target.name, value: e.target.value } })
  }

  const handleGearDPChange = (e) => {
    const pattern = new RegExp(e.target.pattern)
    const validity = pattern.test(e.target.value) && pattern.test(e.target.value)
    if (validity) dispatch({ type: 'EDIT_SESSION_INPUT_CHANGE', payload: { name: e.target.name, value: e.target.value } })
  }

  const handleClose = (e) => {
    e.preventDefault()
    onCloseClick(false)
  }

  return (
    <div className='sessionEditForm'>
      <form aria-label='sessionEditForm' onSubmit={handleAddSessionSubmit}>
        <button type='button' aria-label='sessionEditExitButton' className='close' onClick={handleClose}>
          X
        </button>
        <label htmlFor='date'>Date</label>
        <input aria-label='dateInput' type='Date' name='date' id='date' onChange={handleDateChange} value={state.date} />
        <label htmlFor='siteName'>Site Name</label>
        <input type='text' aria-label='SiteNameInput' name='siteName' id='siteName' onChange={handleSiteNameChange} value={state.siteName} />
        <label htmlFor='timeSpent'>Time Spent</label>
        <input type='text' aria-label='TimeSpentInput' name='timeSpent' id='timeSpent' pattern='^\d*$' onChange={handleTimeSpentChange} value={state.timeSpent} />
        <label htmlFor='earnings'>Earnings</label>
        <input type='text' aria-label='EarningsInput' name='earnings' id='earnings' pattern='^\d*$' onChange={handleEarningsChange} value={state.earnings} />
        <label htmlFor='averageEarnings'>Average Earnings</label>
        <input type='text' aria-label='AverageEarningsInput' name='averageEarnings' id='averageEarnings' pattern='^\d*$' onChange={handleAverageEarningsChange} value={state.averageEarnings} />
        <label htmlFor='expenses'>Expenses</label>
        <input type='text' aria-label='ExpensesInput' name='expenses' id='expenses' pattern='^\d*$' onChange={handleExpensesChange} value={state.expenses} />
        <label htmlFor='AP'>Total AP</label>
        <input type='text' aria-label='TotalAPInput' name='AP' id='AP' pattern='^\d*$' onChange={handleGearAPChange} value={state.gear.TotalAP} />
        <label htmlFor='DP'>Total DP</label>
        <input type='text' aria-label='TotalDPInput' name='DP' id='DP' pattern='^\d*$' onChange={handleGearDPChange} value={state.gear.TotalDP} />
        <button type='submit' aria-label='sessionEditSubmitButton' name='sessionEditSubmit'>
          Submit
        </button>
      </form>
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
