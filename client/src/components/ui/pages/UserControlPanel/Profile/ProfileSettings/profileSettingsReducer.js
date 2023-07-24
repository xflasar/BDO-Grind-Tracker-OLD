export const INITIAL_STATE = {
  userSettings: null,
  regionServer: '',
  valuePack: false,
  merchantRing: false,
  familyFame: 0,
  tax: 0
}

export const profileSettingsReducer = (state, action) => {
  console.log(action)
  console.log(state)
  switch (action.type) {
    case 'PROFILE_SETTINGS_UPDATE_FETCH':
      return {
        ...state,
        userSettings: action.payload,
        regionServer: action.payload.RegionServer,
        valuePack: action.payload.ValuePack,
        merchantRing: action.payload.MerchantRing,
        familyFame: action.payload.FamilyFame,
        tax: action.payload.Tax
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
