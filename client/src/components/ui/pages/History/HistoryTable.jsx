import React from 'react'
import PropTypes from 'prop-types'
import '../../../../assets/components/ui/History/HistoryTable.scss'

const HistoryTable = ({ data, onEditTrigger, onDeleteTrigger, onOpenSessionViewer }) => {
  const data1 = []
  for (let i = 0; i < data.length; i++) {
    data1.push(data[i])
    data1.push(data[i])
    data1.push(data[i])
    data1.push(data[i])
    data1.push(data[i])
    data1.push(data[i])
  }

  data = data1

  const handleOpenSessionViewer = (e, item) => {
    if (e.target.className.includes('history-table-item-button')) return

    onOpenSessionViewer(item)
  }

  const renderTableRow = (item) => {
    return (
      <>
        <td className="history-table-item" role="historyTableItem">{item.Date}</td>
        <td className="history-table-item" role="historyTableItem">{item.SiteId}</td>
        <td className="history-table-item" role="historyTableItem">{item.sessionTime}</td>
        <td className="history-table-item" role="historyTableItem">{item.totalSilverAfterTaxes}</td>
        <td className="history-table-item" role="historyTableItem">{item.Expenses} Not Implemented!</td>
        <td className="history-table-item" role="historyTableItem">{item.Loadout.name}</td>
      </>
    )
  }

  return (
  <table role="historyTable" className="history-table">
    <thead className="history-table-header">
      <tr>
        <th>Date</th>
        <th>Site Name</th>
        <th>Time Spent</th>
        <th>Earnings</th>
        <th>Expenses</th>
        <th>Loadout</th>
      </tr>
    </thead>
    <tbody className="history-table-content">
    {data?.map((item, index) => (
      <tr key={item._id} className="history-table-row" role="historyTableRow" onClick={(e) => handleOpenSessionViewer(e, item)}>
        {renderTableRow(item)}
        <td className="history-table-control" role="historyTableItem" key={`${item._id}_controls`}>
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
  onDeleteTrigger: PropTypes.func,
  onOpenSessionViewer: PropTypes.func.isRequired
}

export default HistoryTable
