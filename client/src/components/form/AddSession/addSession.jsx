import React, { useReducer } from 'react'
import PropTypes from 'prop-types'
import '../../../assets/components/form/addNewSession.scss'
import { INITIAL_STATE, addSessionReducer } from './addSessionReducer'

const AddSession = ({ onAddSessionSuccess, authorizedFetch, onCloseClick }) => {
  const [state, dispatch] = useReducer(addSessionReducer, INITIAL_STATE)
  async function handleAddSessionSubmit (e) {
    e.preventDefault()
    const sessionData = {
      SiteName: state.SiteName,
      TimeSpent: parseInt(state.TimeSpent),
      TotalEarned: parseInt(state.TotalEarned),
      TotalExpenses: parseInt(state.TotalSpent),
      AP: parseInt(state.AP),
      DP: parseInt(state.DP)
    }

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

  const handleSiteNameChange = (e) => {
    dispatch({ type: 'ADD_SESSION_INPUT_CHANGE', payload: { name: e.target.name, value: e.target.value } })
  }

  const handleTimeSpentChange = (e) => {
    const pattern = new RegExp(e.target.pattern)
    const validity = pattern.test(e.target.value) && pattern.test(e.target.value)
    if (validity) dispatch({ type: 'ADD_SESSION_INPUT_CHANGE', payload: { name: e.target.name, value: e.target.value } })
  }

  const handleTotalEarnedChange = (e) => {
    const pattern = new RegExp(e.target.pattern)
    const validity = pattern.test(e.target.value) && pattern.test(e.target.value)
    if (validity) dispatch({ type: 'ADD_SESSION_INPUT_CHANGE', payload: { name: e.target.name, value: e.target.value } })
  }

  const handleTotalSpentChange = (e) => {
    const pattern = new RegExp(e.target.pattern)
    const validity = pattern.test(e.target.value) && pattern.test(e.target.value)
    if (validity) dispatch({ type: 'ADD_SESSION_INPUT_CHANGE', payload: { name: e.target.name, value: e.target.value } })
  }

  const handleAPChange = (e) => {
    const pattern = new RegExp(e.target.pattern)
    const validity = pattern.test(e.target.value) && pattern.test(e.target.value)
    if (validity) dispatch({ type: 'ADD_SESSION_INPUT_CHANGE', payload: { name: e.target.name, value: e.target.value } })
  }

  const handleDPChange = (e) => {
    const pattern = new RegExp(e.target.pattern)
    const validity = pattern.test(e.target.value) && pattern.test(e.target.value)
    if (validity) dispatch({ type: 'ADD_SESSION_INPUT_CHANGE', payload: { name: e.target.name, value: e.target.value } })
  }

  const handleClose = (e) => {
    e.preventDefault()
    onCloseClick()
  }

  // This can be probably made into custom input and then map the INITIAL_STATE OF REDUCER to show inputs
  return (
        <div className='sessionAddForm'>
              <form aria-label='sessionAddForm' onSubmit={handleAddSessionSubmit}>
              <button type='button' aria-label='addSessionExitButton' className='close' onClick={handleClose}>X</button>
                <label htmlFor='SiteName'>Site Name</label>
                <input type='text' aria-label='Site Name' name='SiteName' id='SiteName' value={state.SiteName} onChange={handleSiteNameChange}/>
                <label htmlFor='TimeSpent'>Time Spent</label>
                <input type='text' aria-label='Time Spent' name='TimeSpent' id='TimeSpent' pattern='^\d*$' value={state.TimeSpent} onChange={handleTimeSpentChange}/>
                <label htmlFor='TotalEarned'>Earnings</label>
                <input type='text' aria-label='Earnings' name='TotalEarned' id='TotalEarned' pattern='^\d*$' value={state.TotalEarned} onChange={handleTotalEarnedChange}/>
                <label htmlFor='TotalSpent'>Expenses</label>
                <input type='text' aria-label='Expenses' name='TotalSpent' id='TotalSpent' pattern='^\d*$' value={state.TotalSpent} onChange={handleTotalSpentChange}/>
                <label htmlFor='gear'>Gear</label>
                <input type='text' aria-label='TotalAP' name='AP' id='AP' pattern='^\d*$' value={state.AP} onChange={handleAPChange}/>
                <input type='text' aria-label='TotalDP' name='DP' id='DP' pattern='^\d*$' value={state.DP} onChange={handleDPChange}/>
                <button type='submit' aria-label='addSessionSubmitButton' name='sessionAddSubmit'>
                  Submit
                </button>
            </form>
        </div>
  )
}

AddSession.propTypes = {
  onAddSessionSuccess: PropTypes.func.isRequired,
  authorizedFetch: PropTypes.func.isRequired,
  onCloseClick: PropTypes.func.isRequired
}

export default AddSession
