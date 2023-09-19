import React, { useContext, useEffect, useReducer } from 'react'
import '../../../../../../assets/pages/UserControlPanel/ProfileSettings/ProfileSettings.scss'
import { SessionContext } from '../../../../../../contexts/SessionContext'
import { INITIAL_STATE, profileSettingsReducer } from './profileSettingsReducer'

const ProfileSettings = () => {
  const { isSignedIn, authorizedFetch } = useContext(SessionContext)
  const [state, dispatch] = useReducer(profileSettingsReducer, INITIAL_STATE)

  async function FetchUserData () {
    const response = await authorizedFetch('api/user/usersettingsdata')
    const data = await response.json()
    if (data) {
      dispatch({ type: 'PROFILE_SETTINGS_UPDATE_FETCH', payload: data })
    }
  }

  useEffect(() => {
    if (!isSignedIn) {
      window.location.href = '/'
      return
    }

    if (!state.userSettings) {
      FetchUserData()
    }
  }, [isSignedIn, state.userSettings])

  const handleRegionServerChange = (e) => {
    dispatch({ type: 'PROFILE_SETTINGS_INPUT_CHANGE', payload: { name: e.target.name, value: e.target.value } })
  }

  const handleValuePackChange = (e) => {
    dispatch({ type: 'PROFILE_SETTINGS_INPUT_CHANGE', payload: { name: e.target.name, value: e.target.checked } })
  }

  const handleMerchantRingChange = (e) => {
    dispatch({ type: 'PROFILE_SETTINGS_INPUT_CHANGE', payload: { name: e.target.name, value: e.target.checked } })
  }

  const handleFamilyFameChange = (e) => {
    let tempFamilyFame = e.target.value.trim()

    if (tempFamilyFame === '' || isNaN(tempFamilyFame)) {
      tempFamilyFame = 0
    } else {
      tempFamilyFame = parseInt(tempFamilyFame, 10)

      if (isNaN(tempFamilyFame)) {
        tempFamilyFame = 0
      }
    }
    dispatch({ type: 'PROFILE_SETTINGS_INPUT_CHANGE', payload: { name: e.target.name, value: tempFamilyFame } })
  }

  async function SaveSettingsData (e) {
    e.preventDefault()
    const regionServer = state.regionServer
    const valuePack = state.valuePack
    const merchantRing = state.merchantRing
    const familyFame = state.familyFame

    const response = await authorizedFetch('api/user/setusersettingsdata', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        regionServer,
        valuePack,
        merchantRing,
        familyFame
      })
    })
    if (response.ok) {
      const data = await response.json()
      dispatch({ type: 'PROFILE_SETTINGS_UPDATE_FETCH', payload: data })
    } else {
      console.log('Failed to save settings data')
    }
  }

  return (
        <div aria-label='profileSettings-container' className='profileSettings-container'>
            {state.userSettings
              ? (
            <form aria-label='profileSettings-container-form'>
                <div className='profileSettings-container-form-inputlabel'>
                  <label htmlFor='regionServer'>Server/Region:</label>
                  <input type='text' id='regionServer' name='regionServer' placeholder='Server/Region' value={state.regionServer} onChange={handleRegionServerChange} />
                  <label htmlFor='grindingPreference'>Grinding preference:</label>
                  <div className='profileSettings-container-form-inputlabel-grindingPreference'>
                      <label htmlFor='valuePack'>Value Pack</label>
                      <input type='checkbox' id='valuePack' name='valuePack' checked={state.valuePack} onChange={handleValuePackChange}/>
                      <label htmlFor='merchantRing'>Merchant Ring</label>
                      <input type='checkbox' id='merchantRing' name='merchantRing' checked={state.merchantRing} onChange={handleMerchantRingChange}/>
                      <label htmlFor='familyFame'>Family Fame</label>
                      <input type='text' id='familyFame' name='familyFame' pattern='[0-9.]+' value={state.familyFame} onChange={handleFamilyFameChange}/>
                  </div>
                  <label htmlFor='tax'>Tax</label>
                <div className='profileSettings-container-form-inputlabel-tax'>
                        <input type='text' className='profileSettings-container-form-inputlabel-tax-total' disabled value={((1 + state.tax) * 100).toFixed(2) + '%'} />
                        <div className='profileSettings-container-form-inputlabel-tax-deliminator'>|</div>
                        <input type='text' className='profileSettings-container-form-inputlabel-tax-taxed' disabled value={state.tax * 100 + '%'} />
                </div>
                </div>
                <button id='profileSettingsSaveButton' name='profileSettingsSaveButton' onClick={SaveSettingsData}>Save</button>
            </form>)
              : (<h1>UserSettings not available</h1>)}
        </div>
  )
}

export default ProfileSettings
