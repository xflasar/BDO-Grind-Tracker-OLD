export const INITIAL_STATE = {
  toggleMobileMenu: false,
  mobileMode: false,
  overlayActive: false,
  showSignin: false,
  showSignup: false,
  activeLink: '',
  profileIcon: '',
  profileIconMenu: false

}

export const navbarReducer = (state, action) => {
  switch (action.type) {
    case 'SIGNIN_OVERLAY_SHOW':
      return {
        ...state,
        showSignin: true
      }
    case 'SIGNIN_OVERLAY_HIDE':
      return {
        ...state,
        showSignin: false
      }
    case 'SIGNUP_OVERLAY_SHOW':
      return {
        ...state,
        showSignup: true
      }
    case 'SIGNUP_OVERLAY_HIDE':
      return {
        ...state,
        showSignup: false
      }
    case 'TOGGLE_OVERLAY':
      return {
        ...state,
        overlayActive: action.payload
      }
    case 'PROFILE_ICON_UPDATE':
      return {
        ...state,
        profileIcon: action.payload
      }
    case 'TOGGLE_PROFILE_ICON_MENU':
      return {
        ...state,
        profileIconMenu: action.payload
      }
    case 'MOBILE_MODE_UPDATE':
      return {
        ...state,
        mobileMode: action.payload
      }
    case 'ACTIVE_LINK_UPDATE':
      return {
        ...state,
        activeLink: action.payload
      }
    case 'TOGGLE_MOBILE_MENU':
      return {
        profileIconMenu: action.payload
      }
    case 'SIGNUP_SUCCESS':
      return {
        ...state,
        showSignup: false,
        profileIcon: action.payload
      }
    default:
      return state
  }
}
