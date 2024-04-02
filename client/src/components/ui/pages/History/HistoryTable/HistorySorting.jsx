import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

const HistorySorting = ({ data, dispatch }) => {
  const [sorterSelectedValue, setSorterSelectedValue] = useState('')
  const [unfilteredData, setUnfilteredData] = useState([])
  const [sites, setSites] = useState([])
  const [tooltip, setTooltip] = useState(false)
  const [loading, setLoading] = useState(true)

  // useEffects
  useEffect(() => {
    if (!unfilteredData) {
      setUnfilteredData(data)
    }
    handleGetSessionSites()
  }, [data, unfilteredData])

  // Functions

  function handleGetSessionSites () {
    const uniqueSites = Array.from(
      new Set(unfilteredData.map(session => JSON.stringify({ SiteName: session.SiteName, SiteId: session.SiteId })))
    ).map(JSON.parse)
    setSites(uniqueSites)
  }

  const handleSorterValueChange = (e, key) => {
    const selectedValue = e.target.getAttribute('name')
    setSorterSelectedValue(selectedValue === sorterSelectedValue ? undefined : selectedValue)

    dispatch({
      type: 'SORTER_SELECTION_CHANGE',
      payload: selectedValue === sorterSelectedValue ? undefined : key
    })
  }

  const handleShowFilterInfo = (show) => {
    if (show) {
      setTooltip(true)
    } else {
      setTimeout(() => {
        setTooltip(false)
      }, 200)
    }
  }

  useEffect(() => {
    if (data) {
      setLoading(false)
    }
  }, [data])

  return (
    <section className='history-sorter'>
        <h2>Filter<img src='/assets/infoHover.png' onMouseEnter={() => handleShowFilterInfo(true)} onMouseLeave={() => handleShowFilterInfo(false)}/>:</h2>
        {tooltip && (
          <div className='tooltip'>
            <p>Filter sessions by clicking on site name.</p>
          </div>
        )}
        <div className={loading ? 'history-sorter-holder loading' : 'history-sorter-holder'}>
          {loading && <div className='history-sorter-holder-item loading'>Loading...</div>}
          {sites && !loading && sites.map((site) => {
            return (
              <div key={site.SiteId} className={sorterSelectedValue === site.SiteName ? 'history-sorter-holder-item active' : 'history-sorter-holder-item'} name={site.SiteName} onClick={(e) => handleSorterValueChange(e, site.SiteId)}>
                <span>{site.SiteName}</span>
              </div>
            )
          })}
        </div>
      </section>
  )
}

HistorySorting.propTypes = {
  data: PropTypes.array,
  dispatch: PropTypes.func
}

export default HistorySorting
