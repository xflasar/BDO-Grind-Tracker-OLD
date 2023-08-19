import React, { useEffect, useState } from 'react'
import HomepageBox from '../../components/ui/pages/Homepage/HomepageBox'
import '../../assets/pages/Homepage/UserHomepage.scss'
import NewsHistory from '../../components/ui/pages/Homepage/NewsHistory'
const UserHomepage = () => {
  const [userData, setUserData] = useState([])

  async function fetchUserData () {
    try {
      const response = await fetch('/api/user/homepageuserdata')
      if (response.ok) {
        const data = await response.json()
        setUserData(data)
      } else {
        setUserData([])
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchUserData()
  }, [])

  return (
    <div className='Homepage'>
      <section className='user-data'>
        <img src="/assets/homepageTop.jpg" alt="globalData" />
        <h1>User Data</h1>
        <div className="data-values">
          <div className="data-value val1"><HomepageBox data={{ Title: 'Total Time', Content: userData?.TotalTime }}/></div>
          <div className="data-value val2"><HomepageBox data={{ Title: 'Average Earnings', Content: userData?.AverageEarnings }}/></div>
          <div className="data-value val3"><HomepageBox data={{ Title: 'Top Site', Content: userData?.TopSite }}/></div>
          <div className="data-value val4"><HomepageBox data={{ Title: 'Total Earnings', Content: userData?.TotalEarnings }}/></div>
          <div className="data-value val5"><HomepageBox data={{ Title: 'Total Expenses', Content: userData?.TotalExpenses }}/></div>
        </div>
      </section>
      <section className='additional-content'>
        <h2>Your Recent Activities</h2>
        <ul>
          <li>Completed 10 quests in Valencia region.</li>
          <li>Collected rare items from fishing in Mediah.</li>
          <li>Ranked #1 in Silver earnings for the week.</li>
        </ul>
      </section>

      <section className='news'>
        <NewsHistory/>
      </section>

    </div>
  )
}

export default UserHomepage
