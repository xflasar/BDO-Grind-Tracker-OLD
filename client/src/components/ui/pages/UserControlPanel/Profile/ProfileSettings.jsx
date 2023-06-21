import React, { useContext, useState, useEffect } from 'react'
import '../../../../../assets/pages/UserControlPanel/ProfileSettings/ProfileSettings.scss'
import { SessionContext } from '../../../../../contexts/SessionContext'

const ProfileSettings = () => {
  const [userSettings, setUserSettings] = useState(null)
  const { isSignedIn, authorizedFetch } = useContext(SessionContext)
  const [regionServer, setRegionServer] = useState('')
  const [valuePack, setValuePack] = useState(false)
  const [merchantRing, setMerchantRing] = useState(false)
  const [familyFame, setFamilyFame] = useState(0)
  const [tax, setTax] = useState(0)

  async function FetchUserData () {
    const response = await authorizedFetch('api/user/usersettingsdata')
    const data = await response.json()
    console.log(data)
    if (data) {
      setUserSettings(data)
      setRegionServer(data.RegionServer)
      setValuePack(data.ValuePack)
      setMerchantRing(data.MerchantRing)
      setFamilyFame(data.FamilyFame)
      setTax(data.Tax)
    }
  }

  useEffect(() => {
    if (!isSignedIn) {
      window.location.href = '/'
      return
    }

    if (!userSettings) {
      FetchUserData()
    }
  }, [isSignedIn, userSettings])

  const handleRegionServerChange = (e) => {
    setRegionServer(e.target.value)
  }

  const handleValuePackChange = (e) => {
    setValuePack(e.target.checked)
  }

  const handleMerchantRingChange = (e) => {
    setMerchantRing(e.target.checked)
  }

  const handleFamilyFameChange = (e) => {
    isNaN(e.target.value) ? setFamilyFame(0) : e.target.validity.valid ? setFamilyFame(parseInt(e.target.value)) : setFamilyFame(parseInt(familyFame.toString().replace(/\D/g, ''))) // Fix this it writes NaN if we delete the last number character
  }

  async function SaveSettingsData (e) {
    e.preventDefault()
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
    const data = await response.json()
    if (data.status !== 200) {
      if (data.message === 'Failed to edit data!') {
        console.log('Data failed to be edited.')
      }
    }
  }

  return (
        <div aria-label='profileSettings-container' className='profileSettings-container'>
            {console.log(userSettings)}
            {userSettings
              ? (
            <form aria-label='profileSettings-container-form'>
                <div className='profileSettings-container-form-inputlabel'>
                  <label htmlFor='serverorregion'>Server/Region:</label>
                  <input type='text' id='serverorregion' name='serverorregion' placeholder='Server/Region' value={regionServer} onChange={handleRegionServerChange} />
                  <label htmlFor='grindingPreference'>Grinding preference:</label>
                  <div className='profileSettings-container-form-inputlabel-grindingPreference'>
                      <label htmlFor='valuePack'>Value Pack</label>
                      <input type='checkbox' id='valuePack' name='valuePack' checked={valuePack} onChange={handleValuePackChange}/>
                      <label htmlFor='merchantRing'>Merchant Ring</label>
                      <input type='checkbox' id='merchantRing' name='merchantRing' checked={merchantRing} onChange={handleMerchantRingChange}/>
                      <label htmlFor='familyFame'>Family Fame</label>
                      <input type='text' id='familyFame' name='familyFame' pattern='[0-9.]+' value={familyFame} onChange={handleFamilyFameChange}/>
                      <label htmlFor='tax'>Tax</label>
                      <div className='profileSettings-container-form-inputlabel-grindingPreference-tax'>
                        <p>{(0.60 + tax) * 100}</p>/<p>{tax}</p>
                      </div>
                  </div>
                </div>
                <button id='profileSettingsSaveButton' name='profileSettingsSaveButton' onClick={SaveSettingsData}>Save</button>
            </form>)
              : (<h1>UserSettings not available</h1>)}
        </div>
  )
}

export default ProfileSettings
