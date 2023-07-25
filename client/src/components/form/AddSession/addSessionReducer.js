export const INITIAL_STATE = {
  SiteName: '',
  TimeSpent: '',
  TotalEarned: '',
  AverageEarnings: '',
  TotalSpent: '',
  AP: '',
  DP: ''
}

export const addSessionReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_SESSION_INPUT_CHANGE':
      return {
        ...state,
        [action.payload.name]: action.payload.value
      }
    default:
      return state
  }
}
