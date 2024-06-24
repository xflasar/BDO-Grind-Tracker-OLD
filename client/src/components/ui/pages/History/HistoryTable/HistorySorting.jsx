import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import '../../../../../assets/components/ui/History/Filter.scss'

const HistorySorting = ({ dispatch, authorizedFetch }) => {
  const [sorterSelectedValue, setSorterSelectedValue] = useState('')
  const [sites, setSites] = useState([])
  const [tooltip, setTooltip] = useState(false)
  const [tooltioPosition, setTooltipPosition] = useState({ x: 0, y: 0 })
  const [loading, setLoading] = useState(true)
  const filterImgRef = React.createRef()

  // useEffects
  useEffect(() => {
    handleGetSessionSites()
  }, [])

  // Functions
  async function fetchSessionSites () {
    const response = await authorizedFetch('/api/user/sessions/sites')
    const data = await response.json()
    return data
  }

  async function handleGetSessionSites () {
    const data = await fetchSessionSites()
    setSites(data)
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
      setTooltipPosition({ x: filterImgRef.current.getBoundingClientRect().x, y: filterImgRef.current.getBoundingClientRect().y })
      setTooltip(true)
    } else {
      setTimeout(() => {
        setTooltip(false)
      }, 200)
    }
  }

  useEffect(() => {
    if (sites) {
      setLoading(false)
    }
  }, [sites])

  return (
    <section className='history-filter'>
        {tooltip && (
          ReactDOM.createPortal(
            <div className='tooltip' style={{ left: `${tooltioPosition.x + 25}px`, top: `${tooltioPosition.y - 25}px` }}>
            <p>Filter sessions by clicking on site name.</p>
          </div>,
            document.getElementById('portal-root')
          )
        )}
        <div className={loading ? 'history-filter-holder loading' : 'history-filter-holder'}>
        <img ref={filterImgRef} src='/assets/infoHover.png' onMouseEnter={() => handleShowFilterInfo(true)} onMouseLeave={() => handleShowFilterInfo(false)}/>
          {loading && <div className='history-filter-holder-item loading'>Loading...</div>}
          {sites && !loading && sites.map((site) => {
            return (
              <div key={site.SiteId} className={sorterSelectedValue === site.SiteName ? 'history-filter-holder-item active' : 'history-filter-holder-item'} name={site.SiteName} onClick={(e) => handleSorterValueChange(e, site.SiteId)}>
                <span>{site.SiteName}</span>
              </div>
            )
          })}
        </div>
      </section>
  )
}

HistorySorting.propTypes = {
  dispatch: PropTypes.func,
  authorizedFetch: PropTypes.func
}

export default HistorySorting
