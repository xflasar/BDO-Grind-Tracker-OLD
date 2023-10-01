export const INITIAL_STATE = {
  sessionId: '',
  date: '',
  siteName: '',
  timeSpent: '',
  earnings: '',
  expenses: '',
  gear: {
    TotalAP: 0,
    TotalDP: 0
  }
  /*
    dateError: false,
    siteNameError: false,
    timeSpentError: false,
    earningsError: false,
    averageEarningsError: false,
    expensesError: false,
    gearError: false,
    notesError: false
    */
}

export const editSessionReducer = (state, action) => {
  switch (action.type) {
    case 'EDIT_SESSION_SET_DATA':
      return {
        ...state,
        sessionId: action.payload._id,
        date: action.payload.Date,
        siteName: action.payload.SiteName,
        timeSpent: action.payload.TimeSpent,
        earnings: action.payload.Earnings,
        expenses: action.payload.Expenses,
        gear: action.payload.Gear
      }
    case 'EDIT_SESSION_INPUT_CHANGE':
      return {
        ...state,
        [action.payload.name]: action.payload.value
      }
    default:
      return state
  }
}
