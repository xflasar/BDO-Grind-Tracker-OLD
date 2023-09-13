import React from 'react'
import PropTypes from 'prop-types'
import '../../../../assets/components/ui/History/HistoryTable.scss'

const renderTableCell = (item, itemI, itemIindex) => {
  if (typeof itemI === 'object') {
    return (
      <td key={`${item._id}_${itemIindex}`} className="history-table-item" role="historyTableItem">
        <div className="history-table-item-gear-container">
          <span key={`${item._id}_${itemIindex}`}>
            <p>AP: {itemI.TotalAP}</p>
            <p>AD: {itemI.TotalDP}</p>
          </span>
        </div>
      </td>
    )
  }
  return (
    <td key={`${item._id}_${itemIindex}`} className="history-table-item" role="historyTableItem">
      <p>{itemI}</p>
    </td>
  )
}

const HistoryTable = ({ data, onEditTrigger, onDeleteTrigger }) => (
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
        <th />
      </tr>
    </thead>
    <tbody className="history-table-content">
    {data?.map((item, index) => (
          <tr key={index} className="history-table-row" role="historyTableRow">
            {Object.entries(item).map(([key, value]) => {
              if (key !== '_id') {
                return renderTableCell(item, value, key)
              }
              return null
            })}
          <td className="history-table-item control" role="historyTableItem" key={`${item._id}_controls`}>
            <button className="history-table-item-button edit" role="historyTableItemButton" onClick={() => onEditTrigger(item)}>
              Edit
            </button>
            <button className="history-table-item-button delete" role="historyTableItemButton" onClick={() => onDeleteTrigger(item._id)}>
              Delete
            </button>
          </td>
        </tr>
    ))}
    </tbody>
  </table>
)

HistoryTable.propTypes = {
  data: PropTypes.array,
  onEditTrigger: PropTypes.func,
  onDeleteTrigger: PropTypes.func
}

export default HistoryTable
