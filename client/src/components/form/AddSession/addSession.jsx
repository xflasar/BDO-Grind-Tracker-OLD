import React, { useContext, useEffect, useReducer } from 'react'
import PropTypes from 'prop-types'
import '../../../assets/components/form/addSession.scss'
import { SessionContext } from '../../../contexts/SessionContext'
import { INITIAL_STATE, addSessionReducer } from './addSessionReducer'

const AddSession = ({ onAddSessionSuccess, onCloseClick }) => {
  const { authorizedFetch } = useContext(SessionContext)
  const [state, dispatch] = useReducer(addSessionReducer, INITIAL_STATE)

  useEffect(() => {
    fetchSites()
  }, [])

  async function handleAddSessionSubmit (e) {
    e.preventDefault()
    const formData = new FormData(e.target)
    const formValues = Object.fromEntries(formData.entries())

    try {
      const res = await authorizedFetch('api/user/addsession', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formValues)
      })
      const data = await res.json()
      onAddSessionSuccess({
        Data: data,
        setAddSession: false
      })
    } catch (error) {
      console.log('Failed to add session:', error)
    }
  }

  const fetchDropItems = async (siteId) => {
    try {
      const response = await authorizedFetch(`/api/user/getaddsessionsitesitemdata/${siteId}`)
      const data = await response.json()
      dispatch({ type: 'ADD_SESSION_DROP_ITEMS_FETCH', payload: data })
    } catch (error) {
      console.log('Failed to fetch drop items:', error)
    }
  }

  // eslint-disable-next-line no-unused-vars
  const fetchSites = async () => {
    const response = await authorizedFetch('/api/user/getaddsessionsites')
    if (response.ok) {
      const res = await response.json()
      dispatch({ type: 'ADD_SESSION_SITES_FETCH', payload: res })
    } else {
      console.log('No data. ' + response.message)
    }
  }

  const handleSiteChoosing = (e, siteId) => {
    e.preventDefault()
    dispatch({ type: 'ADD_SESSION_ACTIVE_SITE', payload: siteId })
    fetchDropItems(siteId)
  }

  const handleSettingsDropRateItem = (itemName) => {
    dispatch({ type: 'ADD_SESSION_INPUT_DROPRATE_CHANGE', payload: itemName })
  }

  const handleClose = (e) => {
    e.preventDefault()
    onCloseClick(false)
  }

  return (
    <div className='sessionAddOverlay'>
      <div className='sessionAddOverlay-Content'>
      <form aria-label='sessionAddForm' onSubmit={handleAddSessionSubmit}>
        <button type='button' className='sessionAddOverlay-Content-Close' onClick={handleClose}>X</button>
        <div className='sessionSiteChoosing'>
          <div className='sessionSiteChoosing-Header'>
            <h3>Sites</h3>
          </div>
          <div className='sessionSiteChoosing-SiteList'>
            {state.Sites && (
              Object.values(state.Sites).map((site) => {
                return (<div key={site._id} className='sessionSiteChoosing-SiteList-Item'><label key={site._id} className={state.activeSite === site._id ? 'active' : ''} onClick={(e) => handleSiteChoosing(e, site._id)}>{site.SiteName}</label></div>)
              })
            )}
          </div>
        </div>
        <div className='sessionMainContent'>
        <div className='sessionMainContent-HeaderContent'>
            <div className='sessionMainContent-HeaderContent-SessionTime'>
              <h3>Session Time</h3>
              <div className='sessionMainContent-HeaderContent-SessionTime-Content'>
                <h3>0h</h3>
                <h3>|</h3>
                <h3>0m</h3>
              </div>
            </div>
            <div className='sessionMainContent-HeaderContent-TotalSilverAfterTaxes'>
              <h3>Total Silver After Taxes</h3>
              <div className='sessionMainContent-HeaderContent-TotalSilverAfterTaxes-Content'>
                <h3>0</h3>
              </div>
            </div>
            <div className='sessionMainContent-HeaderContent-SilverPreHourBeforeTaxes'>
              <h3>Silver Pre Hour Before Taxes</h3>
              <div className='sessionMainContent-HeaderContent-SilverPreHourBeforeTaxes-Content'>
                <h3>0</h3>
              </div>
            </div>
            <div className='sessionMainContent-HeaderContent-SilverPreHourAfterTaxes'>
              <h3>Silver Pre Hour After Taxes</h3>
              <div className='sessionMainContent-HeaderContent-SilverPreHourAfterTaxes-Content'>
                <h3>0</h3>
              </div>
            </div>
          </div>
          <div className='sessionMainContent-SetupContent'>
            <div className='sessionMainContent-SetupContent-Items'>
              <h2>Items</h2>
              {state.DropItems.length > 0
                ? (
                <div className='sessionMainContent-SetupContent-Items-Content'>
                    {Object.values(state.DropItems).map((item, index) => {
                      return (<div key={item.itemId ? item.itemId : index} className='sessionMainContent-SetupContent-Items-Content-Item'>
                        <label>{item.itemName}</label>
                        <input type='text' name={item.itemId ? item.itemId : index} placeholder='0'/>
                        </div>)
                    })}
                </div>
                  )
                : (<div style={{ textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', fontSize: '2rem', color: '#ffa600' }}><p>Select Site From Left List!</p></div>)}
            </div>
            <div className='sessionMainContent-SetupContent-Gear'>
              <h2>Gear</h2>
              {state.activeSite ? null : (<div style={{ textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', fontSize: '2rem', color: '#ffa600' }}><p>Select Site From Left List!</p></div>)}
            </div>
            <div className='sessionMainContent-SetupContent-Settings'>
              <h2>Settings</h2>
              {state.activeSite
                ? (
                <div className='sessionMainContent-SetupContent-Settings-Content'>
                  <div className='sessionMainContent-SetupContent-Settings-Content-GridList'>
                    {state.DropRate && (
                      Object.keys(state.DropRate).map((itemName) => {
                        return (
                        <div key={itemName} className={state.DropRate[itemName].active ? 'sessionMainContent-SetupContent-Settings-Content-GridList-Item active' : 'sessionMainContent-SetupContent-Settings-Content-GridList-Item'} onClick={() => handleSettingsDropRateItem(itemName)}>
                          <img src={state.DropRate[itemName].icon}/>
                        </div>
                        )
                      })
                    )}
                  </div>
                </div>
                  )
                : (<div style={{ textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', fontSize: '2rem', color: '#ffa600' }}><p>Select Site From Left List!</p></div>)}
            </div>
          </div>
        </div>
      </form>
      </div>
    </div>
  )
}

AddSession.propTypes = {
  onAddSessionSuccess: PropTypes.func.isRequired,
  onCloseClick: PropTypes.func.isRequired
}

export default AddSession
