import React from 'react'
import PropTypes from 'prop-types'
import '../../../../assets/components/ui/Sites/SiteBox.scss'

class SiteBox extends React.Component {
  render () {
    return (
      <div role='siteBox' className="box-site">
        <div className="box-site-title">{this.props.data.SiteName}</div>
        <div className="box-site-content">
          <div className='box-site-content-totaltime'>
            <h2>TotalTime</h2>
            <p>{this.props.data.TotalTime}</p>
          </div>
          <div className='box-site-content-totalearned'>
            <h2>TotalEarned</h2>
            <p>{this.props.data.TotalEarned}</p>
          </div>
            <div className='box-site-content-totalspent'>
                <h2>TotalSpent</h2>
                <p>{this.props.data.TotalExpenses}</p>
            </div>
            <div className='box-site-content-averageearnings'>
                <h2>AverageEarnings</h2>
                <p>{this.props.data.AverageEarnings}</p>
            </div>
        </div>
      </div>
    )
  }
}
SiteBox.propTypes = {
  data: PropTypes.object
}
export default SiteBox
