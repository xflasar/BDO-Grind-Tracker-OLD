exports.recalculateSilverPerHour = (state, DropItems) => {
  if (DropItems.length === 0) DropItems = state.DropItems
  if (!DropItems) return state

  const totalSilverBeforeTaxes = DropItems.reduce((acc, item) => {
    const itemPrice = Number(item.itemPrice)
    const amount = Number(item.amount)

    if (isNaN(itemPrice) || isNaN(amount)) return acc

    const product = itemPrice * amount

    return acc + product
  }, 0)

  const totalSilverAfterTaxes = DropItems.reduce((acc, item) => {
    const itemPrice = Number(item.itemPrice)
    const amount = Number(item.amount)

    if (isNaN(itemPrice) || isNaN(amount)) return acc

    // fixme: Math.abs useless change api to return positive number
    const product = item.validMarketplace ? ((itemPrice * amount) - ((itemPrice * amount) * Math.abs(state.tax))) : (itemPrice * amount)

    return acc + product
  }, 0)

  const sessionTime = (Number(state.sessionTimeHours) * 60) + Number(state.sessionTimeMinutes)

  let silverPerHourBeforeTaxes = 0
  let silverPerHourAfterTaxes = 0

  if (sessionTime !== 0) {
    silverPerHourBeforeTaxes = Math.round(totalSilverBeforeTaxes / (sessionTime / 60))
    silverPerHourAfterTaxes = Math.round(totalSilverAfterTaxes / (sessionTime / 60))
  }

  const newState = {
    ...state,
    totalSilverAfterTaxes,
    silverPerHourBeforeTaxes,
    silverPerHourAfterTaxes
  }

  return newState
}

// It would be great to only send state/data that we rly need for the method
exports.handleDropItemChange = (dropItems, state, dispatch) => {
  const newState = this.recalculateSilverPerHour(state, dropItems)
  dispatch({ type: 'ADD_SESSION_RECALCULATE_SILVER_CHANGE', payload: newState })
}

// move to HistoryHelper.js
exports.formatNumberWithSpaces = (number) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

exports.handleSessionTimeChange = (e, dispatch) => {
  dispatch({ type: 'ADD_SESSION_INPUT_SESSIONTIME_CHANGE', payload: { name: e.target.name, value: e.target.value } })
}
