export const addSessionReducerINIT = {
  Sites: [],
  SessionData: {
    siteId: '',
    sessionTime: '',
    loadoutId: ''
  },
  sessionTimeHours: 0,
  sessionTimeMinutes: 0,
  Agris: false,
  AgrisTotal: 0,
  activeSite: '',
  SiteName: '',
  totalSilverAfterTaxes: 0,
  silverPerHourBeforeTaxes: 0,
  silverPerHourAfterTaxes: 0,
  tax: 0
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
        activeSite: action.payload,
        SessionData: {
          ...state.SessionData,
          siteId: action.payload
        }
      }
    case 'ADD_SESSION_CLEAR_ACTIVE_SITE':
      return {
        ...state,
        activeSite: '',
        SessionData: {
          siteId: '',
          sessionTime: '',
          loadoutId: ''
        },
        sessionTimeHours: 0,
        sessionTimeMinutes: 0,
        Agris: false,
        AgrisTotal: 0,
        silverPerHourBeforeTaxes: 0,
        silverPerHourAfterTaxes: 0,
        SiteName: ''
      }
    case 'ADD_SESSION_INPUT_CHANGE':
      return {
        ...state,
        [action.payload.name]: action.payload.value
      }
    case 'ADD_SESSION_INPUT_SESSIONTIME_CHANGE':
      return {
        ...state,
        [action.payload.name]: action.payload.value
      }
    case 'ADD_SESSION_RECALCULATE_SILVER_CHANGE':
      state = action.payload
      return state
    case 'ADD_SESSION_SET_TAX':
      return {
        ...state,
        tax: action.payload
      }
    default:
      return state
  }
}
