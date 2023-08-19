import React, { useEffect, useState } from 'react'
import '../../../../assets/components/ui/Homepage/NewsHistory.scss'

// TODO:
// WIP //
// - backend
const NewsHistory = () => {
  const [newsData, setNewsData] = useState([])

  async function fetchNewsData () {
    /* try {
      const response = await fetch('/api/app/news')
      if (response.ok) {
        const data = await response.json()
        console.log(data)
      } else {
        console.log('error')
      }
    } catch (error) {
      console.log(error)
    } */

    // Testing data
    setNewsData(
      [
        {
          title: 'Tefehsdhd fhdfsgh sedhedrhds hsedhs dehd rfjst',
          date: '1 h',
          newsUrl: 'https://www.naeu.playblackdesert.com/News/Notice/Detail?groupContentNo=5802&countryType=en-US',
          newsIcon: 'https://s1.pearlcdn.com/NAEU/Upload/thumbnail/2023/A6KKW1U35EW7J7VN20230818233934433.400x225.png'
        },
        {
          title: 'Tesdrtfhjsdtfjhdfjhst',
          date: '1 h',
          newsUrl: 'https://www.naeu.playblackdesert.com/News/Notice/Detail?groupContentNo=5802&countryType=en-US',
          newsIcon: 'https://s1.pearlcdn.com/NAEU/Upload/thumbnail/2023/A6KKW1U35EW7J7VN20230818233934433.400x225.png'
        },
        {
          title: 'Tedstrjhdtfsjhsdjhsdrtfjhst',
          date: '1 h',
          newsUrl: 'https://www.naeu.playblackdesert.com/News/Notice/Detail?groupContentNo=5802&countryType=en-US',
          newsIcon: 'https://s1.pearlcdn.com/NAEU/Upload/thumbnail/2023/A6KKW1U35EW7J7VN20230818233934433.400x225.png'
        },
        {
          title: 'tehserthesrthjdstjhdsjhsdtjhd',
          date: '1 h',
          newsUrl: 'https://www.naeu.playblackdesert.com/News/Notice/Detail?groupContentNo=5802&countryType=en-US',
          newsIcon: 'https://s1.pearlcdn.com/NAEU/Upload/thumbnail/2023/A6KKW1U35EW7J7VN20230818233934433.400x225.png'
        }
      ]
    )
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
                <p>Updated {news.date} ago</p>
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
