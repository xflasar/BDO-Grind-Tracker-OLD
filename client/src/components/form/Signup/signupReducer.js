export const INITIAL_STATE = {
  username: '',
  email: '',
  password: '',
  usernameError: false,
  usernameErrorMsg: '',
  emailError: false,
  emailErrorMsg: '',
  passwordError: false,
  passwordErrorMsg: ''
}

export const signupReducer = (state, action) => {
  switch (action.type) {
    case 'SIGNUP_INPUT_CHANGE':
      return {
        ...state,
        [action.payload.name]: action.payload.value,
        [action.payload.name + 'Error']: false,
        [action.payload.name + 'ErrorMsg']: ''
      }
    case 'SIGNUP_SUCCESS':
      return {
        ...state,
        username: '',
        email: '',
        password: ''
      }
    case 'SIGNUP_USERNAME_ERROR':
      return {
        ...state,
        usernameError: true,
        usernameErrorMsg: action.payload.msg
      }
    case 'SIGNUP_EMAIL_ERROR':
      return {
        ...state,
        emailError: true,
        emailErrorMsg: action.payload.msg
      }
    case 'SIGNUP_PASSWORD_ERROR':
      return {
        ...state,
        passwordError: true,
        passwordErrorMsg: action.payload.msg
      }
    default:
      return state
  }
}
