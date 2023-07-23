import React, { useEffect, useReducer } from 'react'
import PropTypes from 'prop-types'
import '../../../assets/components/form/editSession.scss'
import { INITIAL_STATE, editSessionReducer } from './editSessionReducer'

const EditSession = ({ data, onEditSuccess, onEditSessionSubmit, onCloseClick }) => {
  const [state, dispatch] = useReducer(editSessionReducer, INITIAL_STATE)
  if (!data) {
    return null
  }

  useEffect(() => {
    dispatch({ type: 'EDIT_SESSION_SET_DATA', payload: data })
  }, [])

  const handleAddSessionSubmit = (e) => {
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
    onEditSessionSubmit(newSession)
    onEditSuccess()
  }

  const handleDateChange = (e) => {
    dispatch({ type: 'EDIT_SESSION_INPUT_CHANGE', payload: { name: e.target.name, value: e.target.value } })
  }

  const handleSiteNameChange = (e) => {
    dispatch({ type: 'EDIT_SESSION_INPUT_CHANGE', payload: { name: e.target.name, value: e.target.value } })
  }

  const handleTimeSpentChange = (e) => {
    dispatch({ type: 'EDIT_SESSION_INPUT_CHANGE', payload: { name: e.target.name, value: e.target.value } })
  }

  const handleEarningsChange = (e) => {
    dispatch({ type: 'EDIT_SESSION_INPUT_CHANGE', payload: { name: e.target.name, value: e.target.value } })
  }

  const handleAverageEarningsChange = (e) => {
    dispatch({ type: 'EDIT_SESSION_INPUT_CHANGE', payload: { name: e.target.name, value: e.target.value } })
  }

  const handleExpensesChange = (e) => {
    dispatch({ type: 'EDIT_SESSION_INPUT_CHANGE', payload: { name: e.target.name, value: e.target.value } })
  }

  const handleGearAPChange = (e) => {
    dispatch({ type: 'EDIT_SESSION_INPUT_CHANGE', payload: { name: 'gear', value: { TotalAP: e.target.value, TotalDP: state.gear.TotalDP } } })
  }

  const handleGearDPChange = (e) => {
    dispatch({ type: 'EDIT_SESSION_INPUT_CHANGE', payload: { name: 'gear', value: { TotalAP: state.gear.TotalAP, TotalDP: e.target.value } } })
  }

  // Handle errors
  /* const handleDateError = () => {
    if (date === '') {
      setDateError(true)
    } else {
      setDateError(false)
    }
  }
  const handleSiteNameError = () => {
    if (siteName === '') {
      setSiteNameError(true)
    } else {
      setSiteNameError(false)
    }
  }
  const handleTimeSpentError = () => {
    if (timeSpent === '') {
      setTimeSpentError(true)
    } else {
      setTimeSpentError(false)
    }
  }
  const handleEarningsError = () => {
    if (earnings === '') {
      setEarningsError(true)
    } else {
      setEarningsError(false)
    }
  }
  const handleAverageEarningsError = () => {
    if (averageEarnings === '') {
      setAverageEarningsError(true)
    } else {
      setAverageEarningsError(false)
    }
  }
  const handleExpensesError = () => {
    if (expenses === '') {
      setExpensesError(true)
    } else {
      setExpensesError(false)
    }
  }
  const handleGearError = () => {
    if (gear === '') {
      setGearError(true)
    } else {
      setGearError(false)
    }
  } */

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
        <input type='text' aria-label='TimeSpentInput' name='timeSpent' id='timeSpent' onChange={handleTimeSpentChange} value={state.timeSpent} />
        <label htmlFor='earnings'>Earnings</label>
        <input type='text' aria-label='EarningsInput' name='earnings' id='earnings' onChange={handleEarningsChange} value={state.earnings} />
        <label htmlFor='averageEarnings'>Average Earnings</label>
        <input type='text' aria-label='AverageEarningsInput' name='averageEarnings' id='averageEarnings' onChange={handleAverageEarningsChange} value={state.averageEarnings} />
        <label htmlFor='expenses'>Expenses</label>
        <input type='text' aria-label='ExpensesInput' name='expenses' id='expenses' onChange={handleExpensesChange} value={state.expenses} />
        <label htmlFor='AP'>Total AP</label>
        <input type='text' aria-label='TotalAPInput' name='AP' id='AP' onChange={handleGearAPChange} value={state.gear.TotalAP} />
        <label htmlFor='DP'>Total DP</label>
        <input type='text' aria-label='TotalDPInput' name='DP' id='DP' onChange={handleGearDPChange} value={state.gear.TotalDP} />
        <button type='submit' aria-label='sessionEditSubmitButton' name='sessionEditSubmit'>
          Submit
        </button>
      </form>
    </div>
  )
}

EditSession.propTypes = {
  onEditSuccess: PropTypes.func.isRequired,
  onEditSessionSubmit: PropTypes.func.isRequired,
  onCloseClick: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired
}

export default EditSession
