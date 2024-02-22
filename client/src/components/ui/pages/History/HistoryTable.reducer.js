exports.INITIAL_STATE = {
  data: [],
  sortName: '',
  sortDirection: '',
  sorterSelectedValue: '',
  sites: []
}

exports.sortReducer = (state, action) => {
  switch (action.type) {
    case 'SET_DATA':
      return {
        ...state,
        data: action.payload.data
      }
    case 'SET_SITES':
      return {
        ...state,
        sites: action.payload
      }
    case 'SORTER_SELECTION_CHANGE':
      return {
        ...state,
        sorterSearchBarValue: action.payload
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
