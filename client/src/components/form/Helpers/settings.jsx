import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import '../../../assets/components/ui/AddSession/addSession.settings.scss'

const AddSessionSettings = ({ state, dispatch }) => {
  const handleSettingsDropRateItem = (itemName) => {
    dispatch({ type: 'ADD_SESSION_INPUT_DROPRATE_CHANGE', payload: itemName })
  }

  /**

  Calculates the total drop rate from state and dispatches an action

  - useEffect hook that runs on state.DropRate change

  calculateTotalDropRate function:
  - Checks if DropRate exists in state
  - Returns total drop rate by reducing over Object.values
  - Sums dropRate if rate item is active
  - Total drop rate value saved to totalDropRate variable

  Conditional dispatch:
  - If total is '0.00', dispatch 0
  - Else parse to float and dispatch

  Dispatched action type:
  - ADD_SESSION_DROP_RATE_TOTAL_CHANGE

  This calculates the total drop rate on state change
  and dispatches the updated value to the store

  **/
  useEffect(() => {
    const calculateTotalDropRate = () => {
      if (!state.DropRate) return 0

      return Object.values(state.DropRate)
        .reduce((acc, rate) => {
          if (rate.active) acc += rate.dropRate
          return acc
        }, 0)
    }

    const totalDropRate = calculateTotalDropRate()

    if (totalDropRate === '0.00') {
      dispatch({
        type: 'ADD_SESSION_DROP_RATE_TOTAL_CHANGE',
        payload: 0
      })
    } else {
      dispatch({
        type: 'ADD_SESSION_DROP_RATE_TOTAL_CHANGE',
        payload: parseFloat(totalDropRate)
      })
    }
  }, [state.DropRate])

  return (
    <div className='sessionMainContent-SetupContent-Settings-Content'>
      <h2>Total Drop Rate: {(state.DropRateTotal * 100).toFixed(0)}%</h2>
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
      </div>
    </div>
  )
}

AddSessionSettings.propTypes = {
  state: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired
}

export default AddSessionSettings
