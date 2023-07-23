export const INITIAL_STATE = {
  sessionId: '',
  date: '',
  siteName: '',
  timeSpent: '',
  earnings: '',
  averageEarnings: '',
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
        date: ParseData(action.payload.Date),
        siteName: action.payload.SiteName,
        timeSpent: action.payload.TimeSpent,
        earnings: action.payload.Earnings,
        averageEarnings: action.payload.AverageEarnings,
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

function ParseData (date) {
  const dateParts = date.split('/')

  const day = dateParts[0].padStart(2, '0')
  const month = dateParts[1].padStart(2, '0')
  const year = dateParts[2]

  const formattedDate = `${year}-${month}-${day}`
  return new Date(formattedDate).toISOString().substring(0, 10)
}
