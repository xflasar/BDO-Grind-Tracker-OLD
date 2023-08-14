import React, { useEffect, useState } from 'react'
import HomepageBox from '../../components/ui/pages/Homepage/HomepageBox'
import '../../assets/pages/Homepage/GuestHomepage.scss'

// TODO:
// - Add lazyLoading to images make the images size smaller
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
      if (currentIndex === 0 && i === currentIndex) {
        imagesE[currentIndex].style.transform = 'translateX(0%)'
        imagesE[currentIndex].style.filter = 'blur(0px)'
        imagesE[currentIndex].style.transform = 'scale(1.2)'
        imagesE[currentIndex].style.zIndex = '999'
      } else if (currentIndex === images.length - 1 && i === currentIndex) {
        imagesE[currentIndex].style.transform = 'translateX(0%)'
        imagesE[currentIndex].style.filter = 'blur(0px)'
        imagesE[currentIndex].style.transform = 'scale(1.2)'
        imagesE[currentIndex].style.zIndex = '999'
      } else if (i === currentIndex) {
        imagesE[i].style.transform = 'translateX(0%)'
        imagesE[i].style.filter = 'blur(0px)'
        imagesE[i].style.transform = 'scale(1.2)'
        imagesE[i].style.zIndex = '999'
        if (currentIndex < imagesE.length - 1) imagesE[i + 1].style.display = 'block'
        if (currentIndex > 0) imagesE[i - 1].style.display = 'block'
      } else if (currentIndex > i) {
        imagesE[i].style.transform = 'translateX(calc(-100% - 20px))'
        imagesE[i].style.filter = 'blur(5px)'
        imagesE[i].style.zIndex = '0'
      } else {
        imagesE[i].style.transform = 'translateX(calc(100% + 20px))'
        imagesE[i].style.filter = 'blur(5px)'
        imagesE[i].style.zIndex = '1'
        imagesE[i].style.display = 'none'
        if (currentIndex + 1 === i) imagesE[i].style.display = 'block'
      }
    }
  }, [currentIndex])

  const handlePrevClick = () => {
    setCurrentIndex(prevIndex => (prevIndex === 0 ? images.length - 1 : prevIndex - 1))
  }

  const handleNextClick = () => {
    setCurrentIndex(prevIndex => (prevIndex === images.length - 1 ? 0 : prevIndex + 1))
  }

  return (
    <div className="homepage">
      <section className="global-data">
        <img src="/assets/homepageTop.jpg" alt="globalDataBackground" />
        <h1>Welcome to the Grind Tracker</h1>
        <h2>Global Data</h2>
        <div className="data-values">
          <div className="data-value val1"><HomepageBox data={{ Title: 'Total Sessions', Content: globalData?.TotalSessions }}/></div>
          <div className="data-value val2"><HomepageBox data={{ Title: 'Total Time', Content: globalData?.TotalTime }}/></div>
          <div className="data-value val3"><HomepageBox data={{ Title: 'Total Earnings', Content: globalData?.TotalEarnings }}/></div>
          <div className="data-value val4"><HomepageBox data={{ Title: 'Top Site', Content: globalData?.TopSite }}/></div>
          <div className="data-value val5"><HomepageBox data={{ Title: 'Total Sessions Today', Content: globalData?.TotalSessionsToday }}/></div>
        </div>
      </section>
      <section className="about">
        <h2>About the Website</h2>
        <p>The Black Desert Online Grinding Tracker enables users to preserve session specifics, including mob interactions, item acquisitions, and session-specific earnings. This utility enhances the ease of monitoring session-based earnings, coupled with accessible functionalities like interactive marketplace visuals. Furthermore, users can efficiently oversee their logged sessions, facilitating the option to modify or remove entries for an all-encompassing and dynamic gaming involvement.</p>
      </section>
      <div className="carousel">
        <button className="previous-button is-control" onClick={handlePrevClick}>
          Previous
        </button>
        <div className="image-container">
          <img
          src={images[currentIndex]}
          className='carousel-image-background'
          alt='bckImage'
          />
          {images.map((image, index) => (
            <img
              style={{ '--currentIndex': index }}
              key={index}
              className={`carousel-image ${index === currentIndex ? 'active' : ''}`}
              src={image}
              alt={`Image ${index + 1}`}
            />
          ))}
        </div>
        <button className="next-button is-control" onClick={handleNextClick}>
        Next
        </button>
      </div>
    </div>
  )
}

export default GuestHomepage
