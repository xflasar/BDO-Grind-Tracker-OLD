export const INITIAL_STATE = {
  Sites: [],
  DropItems: [],
  activeSite: '',
  SiteName: '',
  TimeSpent: '',
  TotalEarned: '',
  TotalSpent: '',
  AP: '',
  DP: ''
}

export const addSessionReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_SESSION_SITES_FETCH':
      return {
        ...state,
        Sites: action.payload
      }
    case 'ADD_SESSION_ACTIVE_SITE':
      return {
        ...state,
        activeSite: action.payload
      }
    case 'ADD_SESSION_INPUT_CHANGE':
      return {
        ...state,
        [action.payload.name]: action.payload.value
      }
    case 'ADD_SESSION_DROP_ITEMS_FETCH':
      return {
        ...state,
        DropItems: action.payload
      }
    default:
      return state
  }
}
