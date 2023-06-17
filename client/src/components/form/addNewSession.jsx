import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import '../../assets/components/form/addNewSession.scss'
import { SessionContext } from '../../contexts/SessionContext'

const AddSession = ({ onAddSessionSuccess, onCloseClick }) => {
  const { authorizedFetch } = useContext(SessionContext)
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

  const handleClose = (e) => {
    e.preventDefault()
    onCloseClick(false)
  }

  return (
        <div className='sessionAddForm'>
              <form aria-label='sessionAddForm' onSubmit={handleAddSessionSubmit}>
              <button type='button' aria-label='addSessionExitButton' className='close' onClick={handleClose}>X</button>
                <label htmlFor='SiteName'>Site Name</label>
                <input type='text' aria-label='Site Name' name='SiteName' id='siteName' />
                <label htmlFor='TimeSpent'>Time Spent</label>
                <input type='text' aria-label='Time Spent' name='TimeSpent' id='timeSpent' pattern='[0-9.]+' />
                <label htmlFor='TotalEarned'>Earnings</label>
                <input type='text' aria-label='Earnings' name='TotalEarned' id='earnings' pattern='[0-9.]+'/>
                <label htmlFor='AverageEarnings'>Average Earnings</label>
                <input type='text' aria-label='Average Earnings' name='AverageEarnings' id='averageEarnings' pattern='[0-9.]+'/>
                <label htmlFor='TotalSpent'>Expenses</label>
                <input type='text' aria-label='Expenses' name='TotalSpent' id='expenses' pattern='[0-9.]+'/>
                <label htmlFor='gear'>Gear</label>
                <input type='text' aria-label='TotalAP' name='AP' id='AP' pattern='[0-9.]+'/>
                <input type='text' aria-label='TotalDP' name='DP' id='DP' pattern='[0-9.]+'/>
                <button type='submit' aria-label='addSessionSubmitButton' name='sessionAddSubmit'>
                  Submit
                </button>
            </form>
        </div>
  )
}

AddSession.propTypes = {
  onAddSessionSuccess: PropTypes.func.isRequired,
  onCloseClick: PropTypes.func.isRequired
}

export default AddSession
