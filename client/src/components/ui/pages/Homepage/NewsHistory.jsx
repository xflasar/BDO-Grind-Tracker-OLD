import React, { useEffect, useState } from 'react'
import '../../../../assets/components/ui/Homepage/NewsHistory.scss'

const NewsHistory = () => {
  const [newsData, setNewsData] = useState([])

  async function fetchNewsData () {
    try {
      const response = await fetch('/api/news')
      if (response.ok) {
        const data = await response.json()
        setNewsData(data)
        console.log(data)
      } else {
        setNewsData([])
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchNewsData()
  }, [])

  return (
    <div className='news-history-container'>
      <h1>News History</h1>
      <div className='news-history-container-holder'>
      {newsData.map((news, index) => (
        <div className='news-history-item' key={index}>
          <a href={news.newsUrl} target='_blank' rel='noreferrer'>
          <img src={news.newsIcon} alt='news' />
          <div className='news-history-item-content'>
              <div className='news-history-item-content-title'>
                <p>{news.title}</p>
              </div>
              <div className='news-history-item-content-date'>
                <p>Published: {news.date}</p>
              </div>
            </div>
          </a>
        </div>
      ))}
      </div>
    </div>
  )
}

export default NewsHistory
