import React from 'react'
import PropTypes from 'prop-types'
import '../../../../assets/components/ui/History/SessionViewer.scss'

const SessionViewer = ({ session, onCloseClick }) => {
  // Closes the form and clears the state
  const handleClose = (e) => {
    e.preventDefault()
    onCloseClick(false)
  }

  return (
    <div className='sessionViewOverlay'>
      <div className='sessionAddOverlay-Content'>
        <button type='button' className='sessionAddOverlay-Content-Close' onClick={handleClose}>X</button>
        <div className='sessionSiteChoosing'>
          <div className='sessionSiteChoosing-Header'>
            <h3>Sites</h3>
            <h3>{session.SiteId}</h3>
          </div>
        </div>

        {/* <div className='sessionMainContent'>
          <div className='sessionMainContent-HeaderContent'>
          {renderHeader()}
          </div>
          <div className='sessionMainContent-SetupContent'>
            <div className='sessionMainContent-SetupContent-Items'>
              <h2>Items</h2>
              {renderDropItems()}
            </div>
            <div className='sessionMainContent-SetupContent-Gear'>
              <h2>Gear</h2>
              {renderLoadout()}
            </div>
            <div className='sessionMainContent-SetupContent-Settings'>
              <h2>Settings</h2>
              {renderSettings()}
            </div>
          </div>
        </div> */}
      </div>
    </div>
  )
}

SessionViewer.propTypes = {
  session: PropTypes.object.isRequired,
  onCloseClick: PropTypes.func.isRequired
}

export default SessionViewer
