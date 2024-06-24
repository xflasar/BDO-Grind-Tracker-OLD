exports.INITIAL_STATE = {
  data: [],
  sortName: '',
  sortDirection: '',
  sites: [],
  filteringValue: undefined,
  paginationMaxElements: 10,
  paginationCurrentPage: 1,
  paginationTotalPages: 1,
  paginationPages: [],
  loading: true
}

exports.sortReducer = (state, action) => {
  switch (action.type) {
    case 'SET_DATA':
      return {
        ...state,
        data: action.payload
      }
    case 'ADD_SESSION':
      return {
        ...state,
        data: [action.payload, ...state.data]
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
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      }
    case 'SORTER_SELECTION_CHANGE':
      return {
        ...state,
        filteringValue: action.payload,
        paginationCurrentPage: 0
      }
    case 'SORT':
      return {
        ...state,
        sortName: action.payload.sortName,
        sortDirection: state.sortDirection === 'asc' ? 'desc' : 'asc'
      }
    case 'SET_PAGINATION_DATA':
    {
      const pages = []
      for (let i = 1; i < action.payload + 1; i++) {
        pages.push(i)
      }

      return {
        ...state,
        paginationTotalPages: action.payload,
        paginationPages: pages
      }
    }
    case 'SET_PAGINATION_MAX_ELEMENTS':
      return {
        ...state,
        paginationMaxElements: action.payload
      }
    case 'SET_PAGINATION_CURRENT_PAGE':
      return {
        ...state,
        paginationCurrentPage: action.payload
      }
    case 'HANDLE_EDIT_SESSION_SUCCESS':
      return {
        ...state,
        data: state.data.map((session) => {
          if (session._id === action.payload._id) {
            return Object.assign({}, session, action.payload)
          }
          return session
        }),
        showEditSession: false
      }
    default:
      return state
  }
}
