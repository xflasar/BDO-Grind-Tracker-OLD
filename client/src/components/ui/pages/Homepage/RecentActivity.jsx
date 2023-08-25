import React, { useContext, useEffect, useState } from 'react'
import '../../../../assets/components/ui/Homepage/RecentActivity.scss'
import { SessionContext } from '../../../../contexts/SessionContext'

const RecentActivity = () => {
  const { authorizedFetch } = useContext(SessionContext)
  const [activityData, setActivityData] = useState(null)
  async function fetchActivityData () {
    try {
      const response = await authorizedFetch('/api/user/recentactivity')
      const data = await response.json()
      setActivityData(data.RecentActivity)
      console.log(data.RecentActivity)
    } catch (err) {
      console.error('Failed to fetch activity data ' + err)
    }
  }

  useEffect(() => {
    fetchActivityData()
  }, [])

  return (
    <div className='recent-activity-container'>
      <h1>Recent Activity</h1>
      <div className='recent-activity-container-holder'>
        {activityData !== null && activityData.map((activity, index) => (
          <div className='recent-activity-container-holder-item' key={index}>
            <div className='recent-activity-container-holder-item-content'>
              <div className='recent-activity-container-holder-item-content-title'>
              <p>{activity.activity}</p>
              </div>
              <div className='recent-activity-container-holder-item-content-date'>
                <p>{activity.date}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RecentActivity
