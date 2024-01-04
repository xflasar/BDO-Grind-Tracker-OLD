export const INITIAL_STATE = {
  data: [],
  editData: null,
  sessionViewerData: null,
  showAddSession: false,
  showEditSession: false
}

export const historyReducer = (state, action) => {
  switch (action.type) {
    case 'SET_HISTORY':
      return {
        ...state,
        data: action.payload
      }
    case 'SHOW_ADD_SESSION':
      return {
        ...state,
        showAddSession: true
      }
    case 'HIDE_ADD_SESSION':
      return {
        ...state,
        showAddSession: false
      }
    case 'HIDE_EDIT_SESSION':
      return {
        ...state,
        showEditSession: false
      }
    case 'HIDE_SESSION_VIEWER':
      return {
        ...state,
        showSessionViewer: false
      }
    case 'HANDLE_SHOW_SESSION_VIEWER':
      console.log(action.payload)
      return {
        ...state,
        showSessionViewer: true,
        sessionViewerData: action.payload
      }
    case 'HANDLE_SHOW_EDIT_SESSION':
      return {
        ...state,
        showEditSession: true,
        editData: action.payload
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
    case 'HANDLE_ADD_SESSION_SUCCESS':
      return {
        ...state,
        data: [...state.data, action.payload],
        showAddSession: false
      }
    default:
      return state
  }
}
