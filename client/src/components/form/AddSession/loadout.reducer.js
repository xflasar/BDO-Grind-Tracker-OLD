export const loadoutReducerINIT = {
  Loadouts: [],
  AddEditLoadoutData: {
    id: '',
    name: '',
    class: '',
    AP: '',
    DP: ''
  },
  AddLoadout: false,
  EditLoadout: false
}

export const loadoutReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_SESSION_ADD_LOADOUT':
      return {
        ...state,
        AddEditLoadoutData: {
          id: '',
          name: '',
          class: '',
          AP: '',
          DP: ''
        },
        EditLoadout: false,
        AddLoadout: true
      }
    case 'ADD_SESSION_EDIT_LOADOUT':
      return {
        ...state,
        AddEditLoadoutData: action.payload,
        AddLoadout: false,
        EditLoadout: true
      }
    case 'ADD_SESSION_CANCEL_ADD_EDIT_LOADOUT':
      return {
        ...state,
        AddLoadout: false,
        EditLoadout: false
      }
    case 'ADD_SESSION_LOADOUTS_FETCH':
      return {
        ...state,
        Loadouts: action.payload,
        AddLoadout: false,
        EditLoadout: false,
        SessionData: {
          ...state.SessionData,
          loadoutId: ''
        }
      }
    case 'ADD_SESSION_ADDEDITLOADOUT_ONCHANGE_INPUT':
      return {
        ...state,
        AddEditLoadoutData: {
          ...state.AddEditLoadoutData,
          [action.payload.name]: action.payload.value
        }
      }
    case 'ADD_SESSION_SUCCESSFULL_ADD_LOADOUT':
      return {
        ...state,
        Loadouts: [...state.Loadouts, action.payload],
        AddLoadout: false
      }
    case 'ADD_SESSION_SUCCESSFULL_EDIT_LOADOUT':
      return {
        ...state,
        Loadouts: state.Loadouts.map((loadout) => {
          if (loadout.id === action.payload.id) {
            return Object.assign({}, loadout, action.payload)
          }
          return loadout
        }),
        EditLoadout: false
      }
    case 'ADD_SESSION_SELECT_LOADOUT':
      return {
        ...state,
        SessionData: {
          ...state.SessionData,
          loadoutId: action.payload
        }
      }
  }
}
