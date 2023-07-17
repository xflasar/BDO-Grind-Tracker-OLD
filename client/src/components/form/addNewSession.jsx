import React, { useState, useContext, useEffect } from 'react'
import PropTypes from 'prop-types'
import '../../assets/components/form/addNewSession.scss'
import { SessionContext } from '../../contexts/SessionContext'

const AddSession = ({ onAddSessionSuccess, onCloseClick }) => {
  const { authorizedFetch } = useContext(SessionContext)

  const [sites, setSites] = useState(null)
  const [activeSite, setActiveSite] = useState('')

  useEffect(() => {
    // fetchSites()
    setSites(
      [
        {
          _id: '5f2d5d0f7e8d9b0b8f8f8f8',
          SiteName: 'Test Site'
        },
        {
          _id: '5f2d5d0f7e8d9b0b8f8f8f2',
          SiteName: 'Test Site'
        },
        {
          _id: '5f2d5d0f7e8d9b0b8f8f8f3',
          SiteName: 'Test Site'
        },
        {
          _id: '5f2d5d0f7e8d9b0b8f8f8f4',
          SiteName: 'Test Site'
        },
        {
          _id: '5f2d5d0f7e8d9b0b8f8f8f5',
          SiteName: 'Test Site'
        },
        {
          _id: '5f2d5d0f7e8d9b0b8f8f8f6',
          SiteName: 'Test Site'
        },
        {
          _id: '5f2d5d0f7e8d9b0b8f8f8f7',
          SiteName: 'Test Site'
        },
        {
          _id: '5f2d5d0f7e8d9b0b8f8f8e1',
          SiteName: 'Test Site'
        },
        {
          _id: '5f2d5d0f7e8d9b0b8f8f8f9',
          SiteName: 'Test Site'
        },
        {
          _id: '5f2d5d0f7e8d9b0b8f8f8f0',
          SiteName: 'Test Site'
        },
        {
          _id: '5f2d5d0f7e8d9b0b8f8f8f1',
          SiteName: 'Test Site'
        },
        {
          _id: '5f2d5d0f7e8d9b0b8f8f8e2',
          SiteName: 'Test Site'
        },
        {
          _id: '5f2d5d0f7e8d9b0b8f8f8e3',
          SiteName: 'Test Site'
        }
      ]
    )
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

  // eslint-disable-next-line no-unused-vars
  const fetchSites = async () => {
    const response = await authorizedFetch('/api/user/getaddsessionsites')
    if (response.ok) {
      const res = await response.json()
      setSites(res)
    } else {
      console.log('No data. ' + response.message)
    }
  }

  const handleSiteChoosing = (siteId) => {
    console.log(`Choosen site with id: ${siteId}`)
    setActiveSite(siteId)
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
            {sites && (
              console.log(sites),
              Object.values(sites).map((site) => {
                return (<div key={site._id} className='sessionSiteChoosing-SiteList-Item'><label key={site._id} className={activeSite === site._id ? 'active' : ''} onClick={() => handleSiteChoosing(site._id)}>{site.SiteName}</label></div>)
              })
            )}
          </div>
        </div>
        <div className='sessionMainContent'>
        <div className='sessionMainContent-HeaderContent'>
            <div className='sessionMainContent-HeaderContent-SessionTime'>
              <h4>Session Time</h4>
              <div className='sessionMainContent-HeaderContent-SessionTime-Content'>
                <p>0h</p>
                <p>|</p>
                <p>0m</p>
              </div>
            </div>
            <div className='sessionMainContent-HeaderContent-TotalSilverAfterTaxes'>
              <h4>Total Silver After Taxes</h4>
              <div className='sessionMainContent-HeaderContent-TotalSilverAfterTaxes-Content'>
                <p>0</p>
              </div>
            </div>
            <div className='sessionMainContent-HeaderContent-SilverPreHourBeforeTaxes'>
              <h4>Silver Pre Hour Before Taxes</h4>
              <div className='sessionMainContent-HeaderContent-SilverPreHourBeforeTaxes-Content'>
                <p>0</p>
              </div>
            </div>
            <div className='sessionMainContent-HeaderContent-SilverPreHourAfterTaxes'>
              <h4>Silver Pre Hour After Taxes</h4>
              <div className='sessionMainContent-HeaderContent-SilverPreHourAfterTaxes-Content'>
                <p>0</p>
              </div>
            </div>
          </div>
          <div className='sessionMainContent-SetupContent'>
            <div className='sessionMainContent-SetupContent-Items'>
              <p>Items</p>
            </div>
            <div className='sessionMainContent-SetupContent-Gear'>
              <p>Gear</p>
            </div>
            <div className='sessionMainContent-SetupContent-Settings'>
              <p>Settings</p>
            </div>
          </div>
          <div className='sessionMainContent-SideContent'>

          </div>
        </div>
      </form>
      </div>
    </div>

  /* <div className='sessionAddForm'>
        <form aria-label='sessionAddForm' onSubmit={handleAddSessionSubmit}>
        <button type='button' aria-label='addSessionExitButton' className='close' onClick={handleClose}>X</button>
          <label htmlFor='SiteName'>Site Name</label>
          <input type='text' aria-label='Site Name' name='SiteName' id='siteName' />
          <label htmlFor='TimeSpent'>Time Spent</label>
          <input type='text' aria-label='Time Spent' name='TimeSpent' id='timeSpent' pattern='[0-9.]+' />
          <label htmlFor='TotalEarned'>Earnings</label>
          <input type='text' aria-label='Earnings' name='TotalEarned' id='earnings' pattern='[0-9.]+'/>
          <label htmlFor='AverageEarnings'>Average Earnings</label>
          <input type='text' aria-label='Average Earnings' name='AverageEarnings' id='averageEarnings' pattern='[0-9.]+'/>
          <label htmlFor='TotalSpent'>Expenses</label>
          <input type='text' aria-label='Expenses' name='TotalSpent' id='expenses' pattern='[0-9.]+'/>
          <label htmlFor='gear'>Gear</label>
          <input type='text' aria-label='TotalAP' name='AP' id='AP' pattern='[0-9.]+'/>
          <input type='text' aria-label='TotalDP' name='DP' id='DP' pattern='[0-9.]+'/>
          <button type='submit' aria-label='addSessionSubmitButton' name='sessionAddSubmit'>
            Submit
          </button>
      </form>
  </div> */
  )
}

AddSession.propTypes = {
  onAddSessionSuccess: PropTypes.func.isRequired,
  onCloseClick: PropTypes.func.isRequired
}

export default AddSession
