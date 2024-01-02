import React, { useEffect } from 'react'
import PropTypes from 'prop-types'

const AddSessionSettings = ({ state, dispatch }) => {
  const handleSettingsDropRateItem = (itemName) => {
    dispatch({ type: 'ADD_SESSION_INPUT_DROPRATE_CHANGE', payload: itemName })
  }

  useEffect(() => {
    const totalDropRate = Object.values(state.DropRate).reduce((acc, rate) => {
      if (rate.active) acc += rate.dropRate
      return acc
    }, 0)

    const parsedTotalDropRate = totalDropRate === '0.00' ? 0 : parseFloat(totalDropRate)

    dispatch({ type: 'ADD_SESSION_DROP_RATE_TOTAL_CHANGE', payload: parsedTotalDropRate })
  }, [state.DropRate])

  return (
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
}

AddSessionSettings.propTypes = {
  state: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired
}

export default AddSessionSettings
