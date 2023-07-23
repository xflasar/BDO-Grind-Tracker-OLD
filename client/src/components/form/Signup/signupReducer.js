export const INITIAL_STATE = {
  username: '',
  email: '',
  password: '',
  usernameError: false
}

export const signupReducer = (state, action) => {
  switch (action.type) {
    case 'SIGNUP_INPUT_CHANGE':
      return {
        ...state,
        [action.payload.name]: action.payload.value,
        usernameError: false
      }
    case 'SIGNUP_SUCCESS':
      return {
        ...state,
        username: '',
        email: '',
        password: ''
      }
    case 'SIGNUP_FAIL':
      return {
        ...state,
        password: '',
        usernameError: true
      }
    default:
      return state
  }
}
