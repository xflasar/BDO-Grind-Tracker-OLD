import React from 'react'
import PropTypes from 'prop-types'
import '../../../../assets/components/ui/History/SessionViewer.scss'
import { formatNumberWithSpaces } from '../../../form/AddSession/addSession.jsx'

const SessionViewer = ({ session, onCloseClick }) => {
  // Closes the form and clears the state
  const handleClose = (e) => {
    e.preventDefault()
    onCloseClick(false)
  }

  const renderDropItems = () => {
    return (
      <>
        {session.DropItems.length > 0
          ? (
          <div className="sessionViewOverlay-Content-Holder-MainContent-DropItems-Content">
            {Object.values(session.DropItems).map((item, index) => {
              return (
                <div
                  key={item.itemId ? item.itemId : item.itemName}
                  className="sessionViewOverlay-Content-Holder-MainContent-DropItems-Content-Item"
                >
                  <div className="sessionViewOverlay-Content-Holder-MainContent-DropItems-Content-Name">
                    <label htmlFor={item.itemId ? item.itemId : item.itemName}>
                      {item.itemName}
                    </label>
                  </div>
                  <div className="sessionViewOverlay-Content-Holder-MainContent-DropItems-Content-Price">
                    <span
                      type="text"
                      name={
                        item.itemId
                          ? item.itemId + '-item-price'
                          : item.itemName + '-item-price'
                      }
                    >
                      {item.itemPrice}
                    </span>
                  </div>
                  <div className="taxableCheckBox">
                    <input
                      type="checkbox"
                      name={
                        item.itemId
                          ? item.itemId + '-item-tax'
                          : item.itemName + '-item-tax'
                      }
                      checked={item.validMarketplace}
                      disabled
                    />
                  </div>
                  <div className="sessionViewOverlay-Content-Holder-MainContent-DropItems-Content-Amount">
                    <span
                      type="text"
                      name={item.itemId ? item.itemId : item.itemName}
                    >
                      {item.amount}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
            )
          : null}
      </>
    )
  }

  const renderHeader = () => {
    return (
      <>
        <div className="sessionViewOverlay-Content-Holder-MainContent-HeaderContent-Site">
          <h3>Site</h3>
          <div className="sessionViewOverlay-Content-Holder-MainContent-HeaderContent-Site-Content">
            <h3>{session.SiteId}</h3>
          </div>
        </div>
        <div className="sessionViewOverlay-Content-Holder-MainContent-HeaderContent-SessionTime">
          <h3>Session Time</h3>
          <div className="sessionViewOverlay-Content-Holder-MainContent-HeaderContent-SessionTime-Content">
            <span
              type="text"
              name="sessionTimeHours"
            >{Math.floor(session.sessionTime / 60)}</span>
            <h3>|</h3>
            <span
              type="text"
              name="sessionTimeMinutes"
            >{session.sessionTime % 60}</span>
          </div>
        </div>
        <div className="sessionViewOverlay-Content-Holder-MainContent-HeaderContent-TotalSilverAfterTaxes">
          <h3>Total Silver After Taxes</h3>
          <div className="sessionViewOverlay-Content-Holder-MainContent-HeaderContent-TotalSilverAfterTaxes-Content">
            <h3>{formatNumberWithSpaces(session.totalSilverAfterTaxes)}</h3>
          </div>
        </div>
        <div className="sessionViewOverlay-Content-Holder-MainContent-HeaderContent-SilverPreHourBeforeTaxes">
          <h3>Silver Per Hour Before Taxes</h3>
          <div className="sessionViewOverlay-Content-Holder-MainContent-HeaderContent-SilverPreHourBeforeTaxes-Content">
            <h3>{formatNumberWithSpaces(session.silverPerHourBeforeTaxes)}</h3>
          </div>
        </div>
        <div className="sessionViewOverlay-Content-Holder-MainContent-HeaderContent-SilverPreHourAfterTaxes">
          <h3>Silver Per Hour After Taxes</h3>
          <div className="sessionViewOverlay-Content-Holder-MainContent-HeaderContent-SilverPreHourAfterTaxes-Content">
            <h3>{formatNumberWithSpaces(session.silverPerHourAfterTaxes)}</h3>
          </div>
        </div>
      </>
    )
  }

  const renderLoadout = () => {
    return (
      <div className="sessionViewOverlay-Content-Holder-MainContent-SetupContent-Loadout-Item">
        <h4>{session.Loadout.name}</h4>
        <h5>
          Class: <span>{session.Loadout.class}</span>
        </h5>
        <div className="sessionViewOverlay-Content-Holder-MainContent-SetupContent-Loadout-Item-Content">
          <div className="sessionViewOverlay-Content-Holder-MainContent-SetupContent-Loadout-Item-Content-AP">
            <span>AP</span>
            <br />
            <span>{session.Loadout.AP}</span>
          </div>
          <div className="sessionViewOverlay-Content-Holder-MainContent-SetupContent-Loadout-Item-Content-DP">
            <span>DP</span>
            <br />
            <span>{session.Loadout.DP}</span>
          </div>
        </div>
      </div>
    )
  }

  const renderDropRate = () => {
    return (
      <div className="sessionViewOverlay-Content-Holder-MainContent-SetupContent-DropRate-Content">
        <div className="sessionViewOverlay-Content-Holder-MainContent-SetupContent-DropRate-Content-GridList">
          {session.SettingsDropRate.DropRate &&
            Object.keys(session.SettingsDropRate.DropRate).map((itemName) => {
              return (
                <div
                  key={itemName}
                  className={
                    session.SettingsDropRate.DropRate[itemName].active
                      ? 'sessionViewOverlay-Content-Holder-MainContent-SetupContent-DropRate-Content-GridList-Item active'
                      : 'sessionViewOverlay-Content-Holder-MainContent-SetupContent-DropRate-Content-GridList-Item'
                  }
                >
                  <img src={session.SettingsDropRate.DropRate[itemName].icon} />
                </div>
              )
            })}
        </div>
        <div className="sessionViewOverlay-Content-Holder-MainContent-SetupContent-DropRate-Content-Total">
          <h3>Total Drop Rate:</h3>
          <h3>{(session.SettingsDropRate.DropRateTotal * 100).toFixed(0)}%</h3>
        </div>
      </div>
    )
  }

  return (
    <div className="sessionViewOverlay">
      <div className="sessionViewOverlay-Content">
        <div className="sessionViewOverlay-Content-Holder">
          <button
            type="button"
            className="sessionViewOverlay-Content-Close"
            onClick={handleClose}
          >
            X
          </button>
          <div className="sessionViewOverlay-Content-Holder-MainContent">
            <div className="sessionViewOverlay-Content-Holder-MainContent-HeaderContent">
              {renderHeader()}
            </div>
            <div className="sessionViewOverlay-Content-Holder-MainContent-DropItems">
              <h2>Items</h2>
              <div className="sessionViewOverlay-Content-Holder-MainContent-DropItems-Header">
                <span>Item Name</span>
                <span>Price</span>
                <span>Tax</span>
                <span>Amount</span>
              </div>
              {renderDropItems()}
            </div>
            <div className="sessionViewOverlay-Content-Holder-MainContent-SetupContent">
              <div className="sessionViewOverlay-Content-Holder-MainContent-SetupContent-Loadout">
                <h2>Loadout</h2>
                {renderLoadout()}
              </div>
              <div className="sessionViewOverlay-Content-Holder-MainContent-SetupContent-DropRate">
                <h2>DropRate</h2>
                {renderDropRate()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

SessionViewer.propTypes = {
  session: PropTypes.object.isRequired,
  onCloseClick: PropTypes.func.isRequired
}

export default SessionViewer
