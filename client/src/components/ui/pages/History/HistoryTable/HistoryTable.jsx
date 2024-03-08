/* eslint-disable no-unused-vars */
import React, { useEffect, useReducer, useRef, useImperativeHandle } from 'react'
import PropTypes from 'prop-types'
import '../../../../../assets/components/ui/History/HistoryTable.scss'
import HistoryHelper from '../../../../form/Helpers/HistoryHelpers'
import { INITIAL_STATE, sortReducer } from '../HistoryTable.reducer'
import HistorySorting from './HistorySorting'
import HistoryPagination from './HistoryPagination'
import DropDownTableElements from './DropDown'

const HistoryTable = React.forwardRef(({ authorizedFetch, onEditTrigger, onDeleteTrigger, onOpenSessionViewer }, ref) => {
  const [state, dispatch] = useReducer(sortReducer, INITIAL_STATE)

  useImperativeHandle(ref, () => ({
    handleAddSessionDataUpdate (data) {
      if (state.data.length + 1 > state.paginationMaxElements) {
        return
      }
      dispatch({ type: 'ADD_SESSION', payload: data })
    }
  }))

  useEffect(() => {
    // Add ratelimiting with callback to prevent spam
    const fetchData = async () => {
      try {
        const data = await HistoryHelper.fetchData(
          { paginationMaxElements: Number(state.paginationMaxElements), paginationCurrentPage: Number(state.paginationCurrentPage), filteringValue: state.filteringValue },
          authorizedFetch
        )

        dispatch({ type: 'SET_DATA', payload: data.data })
        dispatch({ type: 'SET_PAGINATION_DATA', payload: data.pages })
        dispatch({ type: 'SET_LOADING', payload: false })
      } catch (error) {
        console.error('Error fetching data:', error)
        dispatch({ type: 'SET_DATA', payload: [] })
      }
    }
    fetchData()
  }, [state.paginationMaxElements, state.paginationCurrentPage, state.filteringValue, authorizedFetch])

  // This is mostly wrong way of doing this

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
        <td className="history-table-item" role="historyTableItem">{HistoryHelper.formatSessionTime(item.sessionTime)}</td>
        <td className="history-table-item" role="historyTableItem">{HistoryHelper.formatEarnings(Math.floor(item.totalSilverAfterTaxes))}</td>
        <td className="history-table-item" role="historyTableItem">{item.Expenses} Not Implemented!</td>
        <td className="history-table-item" role="historyTableItem">{item.Loadout.name}</td>
      </>
    )
  }

  // Sorting
  const handleSortingByDate = () => {
    dispatch({ type: 'SORT', payload: { sortName: 'Date' } })
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
    if (state.sortName === '') return
    console.log(state.sortDirection, state.sortName)
    const sortedData = HistoryHelper.sortData(state.data, state.sortName, state.sortDirection)
    dispatch({ type: 'SET_DATA', payload: sortedData })
  }, [state.sortName, state.sortDirection])

  function buildTableHeader (name, fn = null) {
    return (
      <th key={name} onClick={fn != null ? () => fn() : null}>
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
      buildTableHeader('Loadout', handleSortingByLoadout),
      (
        <th key={'dropDown'}>
          <DropDownTableElements dispatch={dispatch} />
        </th>
      )
    ]
  }

  return (
    <>
      <HistorySorting data={state.data} dispatch={dispatch}/>
      <table role="historyTable" className="history-table">
        <thead className="history-table-header">
          <tr>
            {renderTableHeader().map((item) => item)}
          </tr>
        </thead>
        <tbody className='history-table-content'>
        {state.data && !state.loading && state.data.map((item) => (
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
      <section className='history-table-undertable'>
        {state.loading && <div className='history-table-undertable-loading'>
          <span>
            Loading...
          </span>
        </div>}
        {state.paginationPages && (
          <>
            <HistoryPagination paginationPages={state.paginationPages} currentPage={state.paginationCurrentPage} dispatch={dispatch} />
          </>
        )}
      </section>
    </>
  )
})

HistoryTable.displayName = 'HistoryTable'

HistoryTable.propTypes = {
  authorizedFetch: PropTypes.func,
  onEditTrigger: PropTypes.func,
  onDeleteTrigger: PropTypes.func,
  onOpenSessionViewer: PropTypes.func.isRequired
}

export default HistoryTable
