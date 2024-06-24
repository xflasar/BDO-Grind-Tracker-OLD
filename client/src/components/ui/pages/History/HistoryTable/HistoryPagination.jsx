import React from 'react'
import PropTypes from 'prop-types'

const HistoryPagination = ({ paginationPages, currentPage, dispatch }) => {
  const handlePageChange = (page) => {
    if (page === currentPage) return

    dispatch({ type: 'SET_CURRENT_PAGE', payload: page })
    dispatch({ type: 'SET_LOADING', payload: true })
  }

  return (
    <section className="pagination">
        {paginationPages && paginationPages.map((page) => {
          return (
            <button key={page} name="paginationButton" className={ currentPage === page ? 'pagination-button selected' : 'pagination-button' } onClick={() => handlePageChange(page)}>
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
  currentPage: PropTypes.number,
  dispatch: PropTypes.func
}

export default HistoryPagination
