import React, { useEffect, useReducer } from 'react'
import PropTypes from 'prop-types'
import '../../../../assets/components/ui/History/HistoryTable.scss'
import { formatEarnings, formatSessionTime, sortData } from '../../../form/Helpers/HistoryHelpers'
import { INITIAL_STATE, sortReducer } from './HistoryTable.reducer'

const HistoryTable = ({ data, onEditTrigger, onDeleteTrigger, onOpenSessionViewer }) => {
  const [state, dispatch] = useReducer(sortReducer, INITIAL_STATE)

  function handleGetSessionSites () {
    const Sites = []

    data.map((session) => {
      if (!Sites.includes(session.SiteName)) {
        Sites.push(session.SiteName)
      }
      return session
    })

    if (Sites.length > 0) {
      dispatch({ type: 'SET_SITES', payload: Sites })
    }
  }
  useEffect(() => {
    handleGetSessionSites()
    console.log('Sites: ' + state.sites)
  }, [data])

  /* const data1 = []
  for (let i = 0; i < data.length; i++) {
    data1.push(data[i])
    data1.push(data[i])
    data1.push(data[i])
    data1.push(data[i])
    data1.push(data[i])
    data1.push(data[i])
  }

  data = data1 */

  const handleOpenSessionViewer = (e, item) => {
    if (e.target.className.includes('history-table-item-button')) return

    onOpenSessionViewer(item)
  }

  const renderTableRow = (item) => {
    return (
      <>
        <td className="history-table-item" role="historyTableItem">{item.Date}</td>
        <td className="history-table-item" role="historyTableItem">{item.SiteName}</td>
        <td className="history-table-item" role="historyTableItem">{formatSessionTime(item.sessionTime)}</td>
        <td className="history-table-item" role="historyTableItem">{formatEarnings(Math.floor(item.totalSilverAfterTaxes))}</td>
        <td className="history-table-item" role="historyTableItem">{item.Expenses} Not Implemented!</td>
        <td className="history-table-item" role="historyTableItem">{item.Loadout.name}</td>
      </>
    )
  }

  // Sorting
  const handleSortingByDate = () => {
    dispatch({ type: 'SORT', payload: { sortName: 'Date' } })
    data = sortData(data, state.sortName, state.sortDirection)
  }

  const handleSortingBySiteName = () => {
    dispatch({ type: 'SORT', payload: { sortName: 'SiteName' } })
  }

  const handleSortingByTimeSpent = () => {
    dispatch({ type: 'SORT', payload: { sortName: 'TimeSpent' } })
  }

  const handleSortingByEarnings = () => {
    dispatch({ type: 'SORT', payload: { sortName: 'Earnings' } })
  }

  const handleSortingByLoadout = () => {
    dispatch({ type: 'SORT', payload: { sortName: 'Loadout' } })
  }

  useEffect(() => {
    data = sortData(data, state.sortName, state.sortDirection)
    dispatch({ type: 'SET_DATA', payload: { data } })
  }, [data, state.sortName, state.sortDirection])

  function buildTableHeader (name, fn = null) {
    return (
      <th onClick={fn != null ? () => fn() : null}>
        <div className='history-table-header-holder'>
          <span>{name}</span>
          <div className={state.sortName === name.replace(' ', '') && (state.sortDirection === 'asc') ? 'ascending active' : 'ascending'} />
          <div className={state.sortName === name.replace(' ', '') && (state.sortDirection === 'desc') ? 'descending active' : 'descending'} />
        </div>
      </th>
    )
  }

  function renderTableHeader () {
    return [
      buildTableHeader('Date', handleSortingByDate),
      buildTableHeader('Site Name', handleSortingBySiteName),
      buildTableHeader('Time Spent', handleSortingByTimeSpent),
      buildTableHeader('Earnings', handleSortingByEarnings),
      buildTableHeader('Expenses', null),
      buildTableHeader('Loadout', handleSortingByLoadout)
    ]
  }

  const handleSorterSearchBarChange = (e) => {
    dispatch({ type: 'SORTER_INPUT_CHANGE', payload: e.target.name })
    console.log(state.sorterSearchBarValue)
  }

  return (
    <>
      <section className='history-sorter'>
        <div className='history-sorter-holder'>
          {/* change this to a dictionary??? */}
          {state.sites && state.sites.map((site, index) => {
            return (
              <div key={index} className='history-sorter-holder-item' name={site} onClick={(e) => handleSorterSearchBarChange(e)}>
                <span>{site}</span>
              </div>
            )
          })}
        </div>
      </section>
      <table role="historyTable" className="history-table">
        <thead className="history-table-header">
          <tr>
            {renderTableHeader().map((item, index) => item)}
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
    </>
  )
}

HistoryTable.propTypes = {
  data: PropTypes.array,
  onEditTrigger: PropTypes.func,
  onDeleteTrigger: PropTypes.func,
  onOpenSessionViewer: PropTypes.func.isRequired
}

export default HistoryTable
