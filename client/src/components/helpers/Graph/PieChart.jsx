import React, { useState } from 'react'
import PropTypes from 'prop-types'
import '../../../assets/components/helpers/PieChart.scss'

const PieChart = ({ data }) => {
  const [hoveredSector, setHoveredSector] = useState(null)

  const handleSectorHover = (index) => {
    setHoveredSector(index)
  }

  const total = data.reduce((acc, item) => acc + item.value, 0)
  let startAngle = 0

  return (
    <svg className="pie-chart" viewBox="-1 -1 2 2" xmlns="http://www.w3.org/2000/svg">
      {data.map((item, index) => {
        const percentage = (item.value / total) * 360
        const path = createSectorPath(startAngle, startAngle + percentage)

        startAngle += percentage

        return (
          <path
            key={index}
            d={path}
            fill={`${item.color}`}
            onMouseOver={() => handleSectorHover(index)}
            onMouseOut={() => handleSectorHover(null)}
            className={`sector-path ${hoveredSector === index ? 'hovered' : ''}`}
          />
        )
      })}
    </svg>
  )
}

const createSectorPath = (startAngle, endAngle) => {
  const radius = 1
  const start = polarToCartesian(0, 0, radius, endAngle)
  const end = polarToCartesian(0, 0, radius, startAngle)

  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1'

  const pathData = [
    'M', 0, 0,
    'L', start.x, start.y,
    'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y,
    'Z'
  ]

  return pathData.join(' ')
}

const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
  const angleInRadians = (angleInDegrees - 90) * (Math.PI / 180.0)

  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  }
}

PieChart.propTypes = {
  data: PropTypes.array.isRequired
}

export default PieChart
