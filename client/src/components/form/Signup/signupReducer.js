export const INITIAL_STATE = {
  username: '',
  email: '',
  password: '',
  usernameError: false,
  usernameErrorMsg: '',
  emailError: false,
  emailErrorMsg: '',
  passwordError: false,
  passwordErrorMsg: '',
  verificationError: false,
  verificationErrorMsg: '',
  rateLimitEnabled: true,
  rateLimitTimer: 60,
  code: '',
  phase: 1
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
    case 'SIGNUP_PHASE_CHANGE':
      return {
        ...state,
        phase: action.payload.phase
      }
    case 'SIGNUP_CODE_CHANGE':
      return {
        ...state,
        code: action.payload.code,
        verificationError: false,
        verificationErrorMsg: ''
      }
    case 'SIGNUP_VERIFICATION_ERROR':
      return {
        ...state,
        verificationError: true,
        verificationErrorMsg: action.payload.msg
      }
    case 'SIGNUP_RATE_LIMIT_ENABLED':
      return {
        ...state,
        rateLimitEnabled: action.payload.enabled,
        rateLimitTimer: INITIAL_STATE.rateLimitTimer
      }
    case 'SIGNUP_RATE_LIMIT_TIMER':
      return {
        ...state,
        rateLimitTimer: action.payload.timer
      }
    default:
      return state
  }
}
