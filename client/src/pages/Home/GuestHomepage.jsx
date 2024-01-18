import React, { useEffect, useState } from 'react'
import HomepageBox from '../../components/ui/pages/Homepage/HomepageBox'
import '../../assets/pages/Homepage/GuestHomepage.scss'
import NewsHistory from '../../components/ui/pages/Homepage/NewsHistory'

// TODO:
// - Add lazyLoading to images (done) make the images size smaller
// - Make a new homepageTop image
const GuestHomepage = () => {
  const images = [
    '/assets/historyPrev.png',
    '/assets/sitesPrev.png'
  ]

  const [currentIndex, setCurrentIndex] = useState(0)
  const [globalData, setGlobalData] = useState(null)

  async function fetchGlobalData () {
    try {
      const response = await fetch('/api/globaldata')
      if (response.ok) {
        const data = await response.json()
        const globalDataObj = {
          TotalTime: data.TotalTime,
          TotalEarnings: data.TotalEarnings,
          TotalSessions: data.TotalSessions,
          TopSite: data.TopSite,
          TotalSessionsToday: data.TotalSessionsToday
        }
        setGlobalData(globalDataObj)
      } else {
        console.log(response)
        setGlobalData({
          TotalTime: 0,
          TotalEarnings: 0,
          TotalSessions: 0,
          TopSite: '',
          TotalSessionsToday: 0
        })
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchGlobalData()
  }, [])

  useEffect(() => {
    const imagesE = document.querySelectorAll('.carousel-image')
    for (let i = 0; i < images.length; i++) {
      if (currentIndex !== i) {
        imagesE[i].style.filter = 'blur(5px)'
      } else {
        imagesE[i].style.filter = 'blur(0)'
      }
    }

    const imageHolder = document.querySelector('.image-holder')
    imageHolder.style.transform = `translateX(${-currentIndex * 100}%)`
  }, [currentIndex])

  const handlePrevClick = (e) => {
    setCurrentIndex(prevIndex => (prevIndex === 0 ? images.length - 1 : prevIndex - 1))

    const prevClassName = e.target.className
    e.target.className = prevClassName + ' clickedAnim'

    // Fix this when user clicks fast it breaks

    setTimeout(() => {
      e.target.removeAttribute('class')
    }, 200)
  }

  const handleNextClick = (e) => {
    setCurrentIndex(prevIndex => (prevIndex === images.length - 1 ? 0 : prevIndex + 1))

    const prevClassName = e.target.className
    e.target.className = prevClassName + ' clickedAnim'

    // Fix this when user clicks fast it breaks

    setTimeout(() => {
      e.target.removeAttribute('class')
    }, 200)
  }

  return (
    <div className="Homepage">
      <section className="global-data">
        <img src="/assets/homepageTop.jpg" alt="globalDataBackground" />
        <h1>Welcome to the Grind Tracker</h1>
        <h2>Global Data</h2>
        <div className="data-values">
          <div className="data-value val1">
            <HomepageBox
              data={{
                Title: 'Total Sessions',
                Content: globalData?.TotalSessions
              }}
            />
          </div>
          <div className="data-value val2">
            <HomepageBox
              data={{ Title: 'Total Time', Content: globalData?.TotalTime }}
            />
          </div>
          <div className="data-value val3">
            <HomepageBox
              data={{
                Title: 'Total Earnings',
                Content: globalData?.TotalEarnings
              }}
            />
          </div>
          <div className="data-value val4">
            <HomepageBox
              data={{ Title: 'Top Site', Content: globalData?.TopSite }}
            />
          </div>
          <div className="data-value val5">
            <HomepageBox
              data={{
                Title: 'Total Sessions Today',
                Content: globalData?.TotalSessionsToday
              }}
            />
          </div>
        </div>
      </section>
      <section className="bottom-part">
        <div className="bottom-part-aboutSlide-holder">
          <div className="about">
            <h2>About the Website</h2>
            <p>
              The Black Desert Online Grinding Tracker enables users to preserve
              session specifics, including mob interactions, item acquisitions,
              and session-specific earnings. This utility enhances the ease of
              monitoring session-based earnings, coupled with accessible
              functionalities like interactive marketplace visuals. Furthermore,
              users can efficiently oversee their logged sessions, facilitating
              the option to modify or remove entries for an all-encompassing and
              dynamic gaming involvement.
            </p>
          </div>
          <div className="carousel">
            <div className='image-holder'>
              {images.map((image, index) => (
                <img
                loading="lazy"
                style={{ '--currentIndex': index }}
                key={index}
                className={`carousel-image ${
                  index === currentIndex ? 'active' : ''
                }`}
                src={image}
                alt={`Image ${index + 1}`}
                />
              ))}
            </div>
            <div className="carousel-image-holder-controll">
            <button
              className="previous-button is-control"
              onClick={(e) => handlePrevClick(e, 'previous-button')}
              >
                <img src="/assets/arrow-left.png" alt="arrow" />
            </button>
            <button
              className="next-button is-control"
              onClick={(e) => handleNextClick(e, 'next-button')}
              >
              <img src="/assets/arrow-right.png" alt="arrow" />
            </button>
            </div>
          </div>
        </div>
        <section className="news">
          <NewsHistory />
        </section>
      </section>
    </div>
  )
}

export default GuestHomepage
