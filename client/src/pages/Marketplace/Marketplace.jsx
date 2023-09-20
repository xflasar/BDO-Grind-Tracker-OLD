import React, { useContext, useState, useEffect } from 'react'
import '../../assets/pages/Marketplace/Marketplace.scss'
import { SessionContext } from '../../contexts/SessionContext'

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
    category: '',
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
      console.log(res)
      setData(res)
      setTotalItems(res.totalItems)
      setDataLoading(false)
      console.log(dataLoading)
    } catch (error) {
      console.log(error)
      setSearchData({})
    }
  }

  /* const handleSearch = (e) => {
    e.preventDefault()
  } */

  useEffect(() => {
    fetchMarketplaceData()
    setTotalPages(Math.ceil(totalItems / recordsPerPage))
  }, [currentPage])

  return (
    <section className='Marketplace'>
      <h1>Marketplace</h1>
      <div className='Marketplace-container'>
        <aside className='Marketplace-container-menu'>
          <div className='Marketplace-container-menu-header'>
            <h2>Menu</h2>
          </div>
          <div className='Marketplace-container-menu-categories'>
            {/* <div><a onClick={() => setSearchData({ category: 'RegistrationQueue' })}>Registration Queue</a></div>
            <div><div></div><a onClick={() => setSearchData({ category: 'MainWeapon' })}>Main Weapon</a></div>
            <div><a onClick={() => setSearchData({ category: 'SubWeapon' })}>Sub Weapon</a></div>
            <div><a onClick={() => setSearchData({ category: 'AwakeningWeapon' })}>Awakening Weapon</a></div>
            <div><a onClick={() => setSearchData({ category: 'Armor' })}>Armor</a></div>
            <div><a onClick={() => setSearchData({ category: 'Lightstone' })}>Lightstone</a></div>
            <div><a onClick={() => setSearchData({ category: 'Accessories' })}>Accessories</a></div>
            <div><a onClick={() => setSearchData({ category: 'RegistrationQueue' })}>Material</a></div>
            <div><a onClick={() => setSearchData({ category: 'RegistrationQueue' })}>Enhancement Items</a></div>
            <div><a onClick={() => setSearchData({ category: 'RegistrationQueue' })}>Consumables</a></div>
            <div><a onClick={() => setSearchData({ category: 'RegistrationQueue' })}>Life Tools</a></div>
            <div><a onClick={() => setSearchData({ category: 'RegistrationQueue' })}>Alchemy Stone</a></div>
            <div><a onClick={() => setSearchData({ category: 'RegistrationQueue' })}>Magic Crystal</a></div>
            <div><a onClick={() => setSearchData({ category: 'RegistrationQueue' })}>Mount Items</a></div>
            <div><a onClick={() => setSearchData({ category: 'RegistrationQueue' })}>Ship Items</a></div>
            <div><a onClick={() => setSearchData({ category: 'RegistrationQueue' })}>Wagon Items</a></div>
            <div><a onClick={() => setSearchData({ category: 'RegistrationQueue' })}>Furniture Items</a></div> */}
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
              <tr key={item._id}>
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
