export const INITIAL_STATE = {
  Sites: [],
  DropItems: [],
  Loadout: [],
  DropRate: {
    lvlOne: {
      active: false,
      dropRate: 1,
      icon: '../assets/AddSession/lvlOneDropScroll.png'
    },
    lvlTwo: {
      active: false,
      dropRate: 1,
      icon: '../assets/AddSession/lvlTwoDropScroll.png'
    },
    blessingOfKamasylve: {
      active: false,
      dropRate: 0.2,
      icon: '../assets/AddSession/blessingOfKamasylve.webp'
    },
    articFox: {
      active: false,
      dropRate: 0.05,
      icon: '../assets/AddSession/articFox.webp'
    },
    supremeOldMoonScroll: {
      active: false,
      dropRate: 0.5,
      icon: '../assets/AddSession/supremeOldMoonScroll.webp'
    },
    oldMoonTreatyToken: {
      active: false,
      dropRate: 0.05,
      icon: '../assets/AddSession/oldMoonTreatyToken.png'
    },
    jsSpecialScroll: {
      active: false,
      dropRate: 1,
      icon: '../assets/AddSession/jsSpecialScroll.png'
    },
    adventurersLuckOne: {
      active: false,
      dropRate: 0.1,
      icon: '../assets/AddSession/adventurersLuck.webp'
    },
    adventurersLuckTwo: {
      active: false,
      dropRate: 0.2,
      icon: '../assets/AddSession/adventurersLuck.webp'
    },
    adventurersLuckThree: {
      active: false,
      dropRate: 0.3,
      icon: '../assets/AddSession/adventurersLuck.webp'
    },
    adventurersLuckFour: {
      active: false,
      dropRate: 0.4,
      icon: '../assets/AddSession/adventurersLuck.webp'
    },
    adventurersLuckFive: {
      active: false,
      dropRate: 0.5,
      icon: '../assets/AddSession/adventurersLuck.webp'
    },
    goldenBlessingOfAgris: {
      active: false,
      dropRate: 1,
      icon: '../assets/AddSession/goldenBlessingOfAgris.webp'
    },
    eyeOfArsha: {
      active: false,
      dropRate: 0.5,
      icon: '../assets/AddSession/eyeOfArsha.png'
    },
    girinsTear: {
      active: false,
      dropRate: 0.1,
      icon: '../assets/AddSession/girinsTear.webp'
    },
    bonghwangsTear: {
      active: false,
      dropRate: 0.05,
      icon: '../assets/AddSession/bonghwangsTear.webp'
    },
    nightTime: {
      active: false,
      dropRate: 0.1,
      icon: '../assets/AddSession/nightTime.png'
    },
    castleBuff: {
      active: false,
      dropRate: 0.5,
      icon: '../assets/AddSession/castleBuff.png'
    },
    blessingOfTheMorning: {
      active: false,
      dropRate: 0.2,
      icon: '../assets/AddSession/blessingOfTheMorning.png'
    },
    increasedDropRateEvent: {
      active: false,
      dropRate: 0.5,
      icon: '../assets/AddSession/increasedDropRateEvent.png'
    },
    morningLightTraditionalWine: {
      active: false,
      dropRate: 0.3,
      icon: '../assets/AddSession/morningLightTraditionalWine.webp'
    }
  },
  ecologyDropRate: 0,
  nodeLevel: 0,
  DropRateTotal: 0,
  Agris: false,
  AgrisTotal: 0,
  activeSite: '',
  SiteName: '',
  TimeSpent: '',
  TotalEarned: '',
  TotalSpent: ''
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
        activeSite: action.payload
      }
    case 'ADD_SESSION_INPUT_CHANGE':
      return {
        ...state,
        [action.payload.name]: action.payload.value
      }
    case 'ADD_SESSION_DROP_ITEMS_FETCH':
      return {
        ...state,
        DropItems: action.payload
      }
    case 'ADD_SESSION_INPUT_DROPRATE_CHANGE':
      return {
        ...state,
        DropRate: {
          ...state.DropRate,
          [action.payload]: {
            ...state.DropRate[action.payload],
            active: !state.DropRate[action.payload].active
          }
        }
      }
    default:
      return state
  }
}
