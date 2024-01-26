export const settingsReducerINIT = {
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
  ecologyDropRate: 0, // Reimplement
  nodeLevel: 0, // Reimplement
  DropRateTotal: 0
}

export const settingsReducer = (state, action) => {
  switch (action.type) {
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
    case 'ADD_SESSION_DROP_RATE_TOTAL_CHANGE':
      return {
        ...state,
        DropRateTotal: action.payload
      }
    case 'ADD_SESSION_DROP_RATE_CLEAR_DATA':
      return { ...state, DropRate: settingsReducerINIT.DropRate }
    case 'ADD_SESSION_DROP_RATE_SET':
      return {
        ...state,
        DropRate: action.payload.DropRate,
        DropRateTotal: action.payload.DropRateTotal,
        nodeLevel: action.payload.NodeLevel,
        ecologyDropRate: action.payload.EcologyDropRate
      }
  }
}
