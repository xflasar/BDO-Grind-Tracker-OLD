import React, { useContext, useEffect } from 'react'
import { SessionContext } from '../../contexts/SessionContext'

const Marketplace = () => {
  const { authorizedFetch } = useContext(SessionContext)
  async function fetchMarketplaceData () {
    try {
      const data = await authorizedFetch('/api/user/marketplace')
      console.log(data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchMarketplaceData()
  })

  return (
    <div className='marketplace-container'>
      <h1>Marketplace</h1>
      <p>This is the marketplace page</p>
    </div>
  )
}

export default Marketplace
