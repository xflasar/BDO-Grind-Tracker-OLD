import React, { useContext, useState, useEffect } from 'react'
import '../../assets/pages/Marketplace/Marketplace.scss'
import { SessionContext } from '../../contexts/SessionContext'
import MarketplaceMenu from './MarketplaceMenu'

const Marketplace = () => {
  const { authorizedFetch } = useContext(SessionContext)

  const [data, setData] = useState([])
  const [dataLoading, setDataLoading] = useState(true)

  const [currentPage, setCurrentPage] = useState(1)
  // eslint-disable-next-line no-unused-vars
  const [recordsPerPage, setRecordsPerPage] = useState(25)
  const [totalItems, setTotalItems] = useState(null)
  const [totalPages, setTotalPages] = useState(0)

  const [searchData, setSearchData] = useState({
    mainCategory: 'Registration Queue',
    subCategory: '',
    itemName: '',
    itemId: ''
  })

  async function fetchMarketplaceData () {
    try {
      const data = await authorizedFetch('/api/user/marketplace', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          searchData,
          currentPage,
          recordsPerPage,
          docCount: totalItems
        })
      })

      if (!data.ok) throw data
      const res = await data.json()
      setData(res)
      setTotalItems(res.totalItems)
      setDataLoading(false)
    } catch (error) {
      console.log(error)
      setSearchData({})
    }
  }

  const handleSearch = (mainCategory, subCategory) => {
    setSearchData(prevSearchData => ({ ...prevSearchData, mainCategory, subCategory }))
    setCurrentPage(1)
  }

  useEffect(() => {
    fetchMarketplaceData()
    setTotalPages(Math.ceil(totalItems / recordsPerPage))
  }, [searchData])

  return (
    <section className='Marketplace'>
      <h1>Marketplace</h1>
      <div className='Marketplace-container'>
        <aside className='Marketplace-container-menu'>
          <div className='Marketplace-container-menu-header'>
            <h2>Menu</h2>
          </div>
          <div className='Marketplace-container-menu-categories'>
            <MarketplaceMenu handleSearch={handleSearch}/>
          </div>
        </aside>
        <div className='Marketplace-container-maincontent'>
        {dataLoading === true && (
              <div className='Marketplace-container-maincontent-loading'>
                <p>Loading...</p>
              </div>
        )}
        <div className='Marketplace-container-maincontent-table'>
          <table className='fixed_header'>
            <thead>
              <tr>
                <th>Item name</th>
                <th>Item stock</th>
                <th>Item price</th>
              </tr>
            </thead>
            <tbody>
            {(data.items && dataLoading === false)
              ? data.items.map(item => (
              <tr key={item._id + item.identifier}>
                <td><img src={item.Image} alt='' />{item.Name}</td>
                <td>{item.Stock}</td>
                <td>{item.Price}</td>
              </tr>
              ))
              : null}
            </tbody>
          </table>
        </div>
        <div className='Marketplace-container-maincontent-pagination'>
          <button onClick={() => setCurrentPage(currentPage - 1)}>Previous</button>
          <label>{currentPage} of {totalPages}</label>
          <button onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Marketplace
