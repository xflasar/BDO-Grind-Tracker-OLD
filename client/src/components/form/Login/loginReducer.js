export const INITIAL_STATE = {
  username: '',
  password: '',
  usernameError: false,
  passwordError: false,
  usernameErrorMsg: '',
  passwordErrorMsg: ''
}

export const loginReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_FAIL_PASSWORD':
      return {
        ...state,
        username: '',
        password: '',
        passwordError: true,
        passwordErrorMsg: action.payload.msg
      }
    case 'LOGIN_INPUT_ERROR':
      return {
        ...state,
        [action.payload.name]: '',
        [action.payload.name + 'Error']: true,
        [action.payload.name + 'ErrorMsg']: action.payload.msg
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
