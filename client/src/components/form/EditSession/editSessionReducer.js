export const INITIAL_STATE = {
  sessionTimeHours: 0,
  sessionTimeMinutes: 0,
  Agris: false,
  AgrisTotal: 0,
  activeSite: '',
  SiteName: '',
  totalSilverAfterTaxes: 0,
  silverPerHourBeforeTaxes: 0,
  silverPerHourAfterTaxes: 0,
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
        activeSite: action.payload.SiteId,
        sessionTimeHours: action.payload.sessionTime / 60,
        sessionTimeMinutes: action.payload.sessionTime % 60,
        totalSilverAfterTaxes: action.payload.totalSilverAfterTaxes,
        silverPerHourBeforeTaxes: action.payload.silverPerHourBeforeTaxes,
        silverPerHourAfterTaxes: action.payload.silverPerHourAfterTaxes,
        tax: action.payload.tax
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
