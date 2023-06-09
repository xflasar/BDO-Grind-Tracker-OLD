import React, { useState } from 'react'
import PropTypes from 'prop-types'
import '../../assets/components/form/editSession.scss'

const EditSession = ({ data, onEditSuccess, onEditSessionSubmit, onCloseClick }) => {
  const [sessionId] = useState(data ? data._id : '')
  const [date, setDate] = useState(
    data
      ? () => {
          const dateParts = data.Date.split('/')

          const day = dateParts[0].padStart(2, '0')
          const month = dateParts[1].padStart(2, '0')
          const year = dateParts[2]

          const formattedDate = `${year}-${month}-${day}`
          return new Date(formattedDate).toISOString().substring(0, 10)
        }
      : ''
  )
  const [siteName, setSiteName] = useState(data ? data.SiteName : '')
  const [timeSpent, setTimeSpent] = useState(data ? data.TimeSpent : '')
  const [earnings, setEarnings] = useState(data ? data.Earnings : '')
  const [averageEarnings, setAverageEarnings] = useState(data ? data.AverageEarnings : '')
  const [expenses, setExpenses] = useState(data ? data.Expenses : '')
  const [gear, setGear] = useState(data ? data.Gear : '')

  /* const [dateError, setDateError] = useState(false)
  const [siteNameError, setSiteNameError] = useState(false)
  const [timeSpentError, setTimeSpentError] = useState(false)
  const [earningsError, setEarningsError] = useState(false)
  const [averageEarningsError, setAverageEarningsError] = useState(false)
  const [expensesError, setExpensesError] = useState(false)
  const [gearError, setGearError] = useState(false)
  const [notesError, setNotesError] = useState(false) */

  const handleAddSessionSubmit = (e) => {
    e.preventDefault()
    const Date = (() => {
      const dateParts = date.split('-')
      const day = dateParts[2]
      const month = dateParts[1]
      const year = dateParts[0]
      const formattedDate = `${day}/${month}/${year}`
      return formattedDate
    })()
    const SiteName = siteName
    const TimeSpent = parseInt(timeSpent)
    const TotalEarned = parseInt(earnings)
    const AverageEarnings = parseInt(averageEarnings)
    const TotalSpent = parseInt(expenses)
    const Gear = {
      TotalAP: parseInt(gear.TotalAP),
      TotalDP: parseInt(gear.TotalDP)
    }

    const newSession = {
      SessionId: sessionId,
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
    setDate(e.target.value)
  }
  const handleSiteNameChange = (e) => {
    setSiteName(e.target.value)
  }
  const handleTimeSpentChange = (e) => {
    setTimeSpent(e.target.value)
  }
  const handleEarningsChange = (e) => {
    setEarnings(e.target.value)
  }
  const handleAverageEarningsChange = (e) => {
    setAverageEarnings(e.target.value)
  }
  const handleExpensesChange = (e) => {
    setExpenses(e.target.value)
  }
  const handleGearAPChange = (e) => {
    const TotalAP = e.target.value
    const TotalDP = gear.TotalDP
    setGear({ TotalAP, TotalDP })
  }
  const handleGearDPChange = (e) => {
    const TotalAP = gear.TotalAP
    const TotalDP = e.target.value
    setGear({ TotalAP, TotalDP })
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
        <input aria-label='dateInput' type='Date' name='date' id='date' onChange={handleDateChange} value={date} />
        <label htmlFor='siteName'>Site Name</label>
        <input type='text' aria-label='SiteNameInput' name='siteName' id='siteName' onChange={handleSiteNameChange} value={siteName} />
        <label htmlFor='timeSpent'>Time Spent</label>
        <input type='text' aria-label='TimeSpentInput' name='timeSpent' id='timeSpent' onChange={handleTimeSpentChange} value={timeSpent} />
        <label htmlFor='earnings'>Earnings</label>
        <input type='text' aria-label='EarningsInput' name='earnings' id='earnings' onChange={handleEarningsChange} value={earnings} />
        <label htmlFor='averageEarnings'>Average Earnings</label>
        <input type='text' aria-label='AverageEarningsInput' name='averageEarnings' id='averageEarnings' onChange={handleAverageEarningsChange} value={averageEarnings} />
        <label htmlFor='expenses'>Expenses</label>
        <input type='text' aria-label='ExpensesInput' name='expenses' id='expenses' onChange={handleExpensesChange} value={expenses} />
        <label htmlFor='AP'>Total AP</label>
        <input type='text' aria-label='TotalAPInput' name='AP' id='AP' onChange={handleGearAPChange} value={gear.TotalAP} />
        <label htmlFor='DP'>Total DP</label>
        <input type='text' aria-label='TotalDPInput' name='DP' id='DP' onChange={handleGearDPChange} value={gear.TotalDP} />
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
