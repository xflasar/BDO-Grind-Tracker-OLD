export const INITIAL_STATE = {
  username: '',
  password: '',
  usernameError: false,
  passwordError: false
}

export const loginReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_FAIL_USERNAME':
      console.log('LOGIN FAIL USERNAME CALLED')
      return {
        ...state,
        password: '',
        usernameError: true
      }
    case 'LOGIN_FAIL_PASSWORD':
      console.log('LOGIN FAIL PASSWORD CALLED')
      return {
        ...state,
        password: '',
        passwordError: true
      }
    case 'LOGIN_SUCCESS':
      return {
        username: '',
        password: '',
        usernameError: false,
        passwordError: false
      }
    case 'LOGIN_INPUT_UPDATE':
      return {
        ...state,
        [action.payload.name]: action.payload.value,
        usernameError: false,
        passwordError: false
      }
    default:
      return state
  }
}
