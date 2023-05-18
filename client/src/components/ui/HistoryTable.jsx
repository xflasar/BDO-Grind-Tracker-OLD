import React from 'react'
import PropTypes from 'prop-types'
import '../../assets/History/HistoryTable.scss'

const renderTableCell = (itemI, itemIindex) => {
  if (typeof itemI === 'object') {
    return (
        <td key={itemIindex} className="history-table-item" role="historyTableItem">
          <div className="history-table-item-gear-container">
            {Object.values(itemI).map((itemII, itemIIindex) => (
              <p key={itemIIindex}>{itemII}</p>
            ))}
          </div>
        </td>
    )
  }
  return (
      <td key={itemIindex} className="history-table-item" role="historyTableItem">
        <p>{itemI}</p>
      </td>
  )
}

const HistoryTable = ({ data }) => (
    <table role="historyTable" className="history-table">
      <thead className="history-table-header">
        <tr>
          <th>Date</th>
          <th>Site Name</th>
          <th>Time Spent</th>
          <th>Earnings</th>
          <th>Average Earnings</th>
          <th>Expenses</th>
          <th>Gear</th>
        </tr>
      </thead>
      <tbody className="history-table-content">
        {data?.map((item, index) => (
          <tr key={index} className="history-table-row" role='historyTableRow'>
            {Object.values(item).map((itemI, itemIindex) => renderTableCell(itemI, itemIindex))}
          </tr>
        ))}
      </tbody>
    </table>
)

HistoryTable.propTypes = {
  data: PropTypes.array
}

export default HistoryTable
