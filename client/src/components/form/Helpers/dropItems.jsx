import React, { useEffect } from 'react'
import PropTypes from 'prop-types'

const DropItems = ({ state, dispatch, authorizedFetch, siteId, handleDropItemsAmountChange, reload }) => {
  // handling DropItems
  useEffect(() => {
    fetchDropItems(siteId)
  }, [reload])

  useEffect(() => {
    if (!state.DropItems || state.DropItems.length === 0) return

    handleDropItemsAmountChange(state.DropItems)
  }, [state.DropItems])

  const fetchDropItems = async (siteId) => {
    try {
      const response = await authorizedFetch(`/api/user/sites/getitemdata/${siteId}`)
      const data = await response.json()
      dispatch({ type: 'ADD_SESSION_DROP_ITEMS_FETCH', payload: data })
    } catch (error) {
      console.log('Failed to fetch drop items:', error)
    }
  }

  const handleDropItemsPriceChange = (e) => {
    const itemName = e.target.name.replace('-item-price', '')
    dispatch({ type: 'ADD_SESSION_DROP_ITEMS_PRICE_CHANGE', payload: { itemId: itemName, itemPrice: e.target.value } })
  }

  const handleDropItemsAmount = (e) => {
    const itemName = e.target.name.replace('-item-price', '')
    dispatch({ type: 'ADD_SESSION_DROP_ITEMS_PRICE_CHANGE', payload: { itemId: itemName, amount: e.target.value } })
  }

  const handleTaxCheckboxChange = (e) => {
    const itemName = e.target.name.replace('-item-tax', '')
    dispatch({ type: 'ADD_SESSION_DROP_ITEMS_TAX_CHANGE', payload: { itemId: itemName, validMarketplace: e.target.checked } })
  }

  return (
    <>
      {state.DropItems.length > 0
        ? (
        <div className="sessionMainContent-SetupContent-Items-Content">
          {Object.values(state.DropItems).map((item, index) => {
            return (
              <div
                key={item.itemId ? item.itemId : item.itemName}
                className="sessionMainContent-SetupContent-Items-Content-Item"
              >
                <div className="sessionMainContent-SetupContent-Items-Content-Item-Name">
                  <label htmlFor={item.itemId ? item.itemId : item.itemName}>
                    {item.itemName}
                  </label>
                </div>
                <div className="sessionMainContent-SetupContent-Items-Content-Item-Price">
                  <input
                    type="text"
                    name={
                      item.itemId
                        ? item.itemId + '-item-price'
                        : item.itemName + '-item-price'
                    }
                    onChange={(e) => handleDropItemsPriceChange(e)}
                    value={item.itemPrice}
                    placeholder="0"
                  />
                </div>
                <div className="taxableCheckBox">
                  <input
                    type="checkbox"
                    name={
                      item.itemId
                        ? item.itemId + '-item-tax'
                        : item.itemName + '-item-tax'
                    }
                    value={'validMarketplace=' + item.validMarketplace}
                    onChange={(e) => handleTaxCheckboxChange(e)}
                    defaultChecked={item.validMarketplace}
                  />
                </div>
                <div className="sessionMainContent-SetupContent-Items-Content-Item-Amount">
                  <input
                    type="text"
                    name={item.itemId ? item.itemId : item.itemName}
                    onChange={(e) => handleDropItemsAmount(e)}
                    value={item.amount}
                    placeholder="0"
                  />
                </div>
              </div>
            )
          })}
        </div>
          )
        : (
        <div
          style={{
            textAlign: 'center',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            fontSize: '2rem',
            color: '#ffa600'
          }}
        >
          <p>Loading DropItems data!</p>
        </div>
          )}
    </>
  )
}

DropItems.propTypes = {
  state: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  authorizedFetch: PropTypes.func.isRequired,
  siteId: PropTypes.string.isRequired,
  handleDropItemsAmountChange: PropTypes.func.isRequired,
  reload: PropTypes.bool.isRequired
}

export default DropItems
