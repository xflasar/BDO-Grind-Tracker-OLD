export const INITIAL_STATE = {
  sessionTimeHours: 0,
  sessionTimeMinutes: 0,
  originalSessionTimeHours: 0,
  originalSessionTimeMinutes: 0,
  Agris: false,
  AgrisTotal: 0,
  siteId: '',
  siteName: '',
  totalSilverAfterTaxes: 0,
  originalTotalSilverAfterTaxes: 0,
  silverPerHourBeforeTaxes: 0,
  originalSilverPerHourBeforeTaxes: 0,
  silverPerHourAfterTaxes: 0,
  originalSilverPerHourAfterTaxes: 0,
  tax: 0,
  sessionEditStateShow: false,
  sessionEditState: ''
}

export const editSessionReducer = (state, action) => {
  switch (action.type) {
    case 'EDIT_SESSION_SET_DATA':
      return {
        ...state,
        Agris: action.payload.Agris,
        AgrisTotal: action.payload.AgrisTotal,
        siteId: action.payload.SiteId,
        siteName: action.payload.SiteName,
        sessionTimeHours: action.payload.sessionTime / 60,
        originalSessionTimeHours: action.payload.sessionTime / 60,
        sessionTimeMinutes: action.payload.sessionTime % 60,
        originalSessionTimeMinutes: action.payload.sessionTime % 60,
        totalSilverAfterTaxes: action.payload.totalSilverAfterTaxes,
        silverPerHourBeforeTaxes: action.payload.silverPerHourBeforeTaxes,
        silverPerHourAfterTaxes: action.payload.silverPerHourAfterTaxes,
        originalTotalSilverAfterTaxes: action.payload.totalSilverAfterTaxes,
        originalSilverPerHourBeforeTaxes: action.payload.silverPerHourBeforeTaxes,
        originalSilverPerHourAfterTaxes: action.payload.silverPerHourAfterTaxes,
        tax: action.payload.tax
      }
    case 'ADD_SESSION_RECALCULATE_SILVER_CHANGE':
      state = action.payload
      return state
    case 'ADD_SESSION_INPUT_SESSIONTIME_CHANGE':
      return {
        ...state,
        [action.payload.name]: action.payload.value
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
