exports.INITIAL_STATE = {
  data: [],
  sortName: '',
  sortDirection: ''
}

exports.sortReducer = (state, action) => {
  switch (action.type) {
    case 'SET_DATA':
      return {
        ...state,
        data: action.payload.data
      }
    case 'SORT':
      return {
        ...state,
        sortName: action.payload.sortName,
        sortDirection: state.sortDirection === 'asc' ? 'desc' : 'asc'
      }
    default:
      return state
  }
}
