import React from 'react'
import PropTypes from 'prop-types'

const HistoryPagination = ({ paginationPages, dispatch }) => {
  return (
    <section className="pagination">
        {paginationPages && paginationPages.map((page) => {
          return (
            <button key={page} name="paginationButton" onClick={() => dispatch({ type: 'SET_CURRENT_PAGE', payload: page })}>
              {page}
            </button>
          )
        }
        )}
      </section>
  )
}

HistoryPagination.propTypes = {
  paginationPages: PropTypes.array,
  dispatch: PropTypes.func
}

export default HistoryPagination
