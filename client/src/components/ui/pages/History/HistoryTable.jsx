import React from 'react'
import PropTypes from 'prop-types'
import '../../../../assets/components/ui/History/HistoryTable.scss'

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

const HistoryTable = ({ data, onEditTrigger, onDeleteTrigger }) => {
  return (
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
        {data?.map((item) => (
          <tr key={item._id} className="history-table-row" role="historyTableRow">
            {Object.values(item).map((itemI, itemIindex) => {
              if (itemIindex !== 0) {
                return renderTableCell(itemI, itemIindex)
              }
              return null
            })}
            <td className="history-table-item control" role="historyTableItem" key={item._id + '_controls'}>
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
}

HistoryTable.propTypes = {
  data: PropTypes.array,
  onEditTrigger: PropTypes.func,
  onDeleteTrigger: PropTypes.func
}

export default HistoryTable
