export const INITIAL_STATE = {
  userSettings: null,
  regionServer: '',
  valuePack: false,
  merchantRing: false,
  familyFame: 0,
  tax: 0
}

export const profileSettingsReducer = (state, action) => {
  switch (action.type) {
    case 'PROFILE_SETTINGS_UPDATE_FETCH':
      return {
        ...state,
        userSettings: action.payload,
        regionServer: action.payload.region,
        valuePack: action.payload.valuePack,
        merchantRing: action.payload.merchantRing,
        familyFame: action.payload.familyFame,
        tax: action.payload.tax
      }
    case 'PROFILE_SETTINGS_INPUT_CHANGE':
      return {
        ...state,
        [action.payload.name]: action.payload.value
      }
    default:
      return state
  }
}
