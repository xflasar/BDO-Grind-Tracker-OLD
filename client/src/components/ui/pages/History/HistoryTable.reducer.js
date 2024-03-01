exports.INITIAL_STATE = {
  data: [],
  sortName: '',
  sortDirection: '',
  sites: [],
  filteringValue: undefined,
  paginationMaxElements: 10,
  paginationCurrentPage: 1,
  paginationTotalPages: 1,
  paginationPages: []
}

exports.sortReducer = (state, action) => {
  switch (action.type) {
    case 'SET_DATA':
      return {
        ...state,
        data: action.payload
      }
    case 'CHANGE_STATE_SHOW_HOVER_INFO':
      return {
        ...state,
        showHoverInfo: action.payload
      }
    case 'SET_SITES':
      return {
        ...state,
        sites: action.payload
      }
    case 'SORTER_SELECTION_CHANGE':
      return {
        ...state,
        filteringValue: action.payload
      }
    case 'SORT':
      return {
        ...state,
        sortName: action.payload.sortName,
        sortDirection: state.sortDirection === 'asc' ? 'desc' : 'asc'
      }
    case 'SET_CURRENT_PAGE':
      return {
        ...state,
        paginationCurrentPage: action.payload
      }
    case 'SET_PAGINATION_DATA':
    {
      const pages = []
      for (let i = 1; i < action.payload + 1; i++) {
        pages.push(i)
      }
      console.log(pages)
      return {
        ...state,
        paginationTotalPages: action.payload,
        paginationPages: pages
      }
    }
    default:
      return state
  }
}
