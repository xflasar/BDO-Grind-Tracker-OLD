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
          <img loading='lazy' src={news.newsIcon} alt='news' />
          <div className='news-history-item-content' style={{ filter: news.desc === '' ? 'none' : '' }}>
              <div className='news-history-item-content-title'>
                <p>{news.title}</p>
              </div>
              <div className='news-history-item-content-date'>
                <p>Published: {news.date}</p>
              </div>
              <div className='news-history-item-content-cate'>
                <div className='news-history-item-content-cate-overlay' style={{ backgroundColor: news.category === 'Notices' ? '#64321e' : news.category === 'Updates' ? '#931313' : news.category === 'Events' ? '#31395e' : news.category === 'GMNotes' ? '#977b4c' : '#7797bf' }}>
                <span>{news.category}</span>
                </div>
              </div>
            </div>
          </a>
          <div className='news-history-item-desc'>
            <p>{news.desc}</p>
          </div>
        </div>
      ))}
      </div>
    </div>
  )
}

export default NewsHistory
