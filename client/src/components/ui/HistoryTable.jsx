import React from 'react'
import PropTypes from 'prop-types'

class HistoryTable extends React.Component {
  render () {
    return (
        <div role='historyTable' className="history-table">
            <div className="history-table-header">
                <p>Header</p>
            </div>
            <div className="history-table-content">
            {this.props.data && Object.values(this.props.data).map((item, index) => {
              return (
                <div role='historyTableItem' key={index} className="history-table-item">
                    <div>{item.Date}</div>
                    <div>{item.SiteName}</div>
                    <div>{item.TimeSpent}</div>
                    <div>{item.Earnings}</div>
                    <div>{item.Expenses}</div>
                    <div>{item.AverageEarnings}</div>
                </div>
              )
            })}
            </div>
        </div>
    )
  }
}

HistoryTable.propTypes = {
  data: PropTypes.array
}

export default HistoryTable
