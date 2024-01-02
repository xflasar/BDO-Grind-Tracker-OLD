export const dropItemReducerINIT = {
  DropItems: []
}

const handleDropItemsChange = (state, action) => {
  const updatedDropItems = state.DropItems.map((item) => {
    if (item.itemId === action.payload.itemId || item.itemName === action.payload.itemId) {
      return { ...item, ...action.payload }
    }
    return item
  })

  const newState = {
    ...state,
    DropItems: updatedDropItems
  }

  return newState
}

export const dropItemReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_SESSION_DROP_ITEMS_FETCH':
      return {
        ...state,
        DropItems: action.payload
      }
    case 'ADD_SESSION_DROP_ITEMS_PRICE_CHANGE':
      return handleDropItemsChange(state, action)
    case 'ADD_SESSION_DROP_ITEMS_AMOUNT_CHANGE':
      console.log(action.payload)
      return handleDropItemsChange(state, action)
    case 'ADD_SESSION_DROP_ITEMS_TAX_CHANGE':
      return handleDropItemsChange(state, action)
    case 'ADD_SESSION_DROP_ITEM_TAX_CHANGE':
      return handleDropItemsChange(state, action)
    default:
      return state
  }
}
