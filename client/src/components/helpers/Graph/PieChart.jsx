// PieChart.jsx

import React from 'react'
import '../../../assets/components/helpers/PieChart.scss'
import PropTypes from 'prop-types'

const PieChart = ({ data }) => {
  const total = data.reduce((acc, item) => acc + item.value, 0)
  let startAngle = 0

  return (
    <div className="pie-chart">
      {data.map((item, index) => {
        const percentage = (item.value / total) * 100
        const color = getRandomColor()

        const clipPath = generateClipPath(startAngle, startAngle + percentage)

        const style = {
          clipPath,
          backgroundColor: color
        }

        startAngle += percentage

        return (
          <div key={index} className="segment" style={style}>
            <span>{item.name}</span>
            <span>{item.value}</span>
          </div>
        )
      })}
    </div>
  )
}

const getRandomColor = () => {
  const letters = '0123456789ABCDEF'
  let color = '#'
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color
}

const generateClipPath = (startAngle, endAngle) => {
  const numPoints = 50
  const points = []

  for (let i = 0; i <= numPoints; i++) {
    const angle = ((endAngle - startAngle) * i) / numPoints + startAngle
    const x = Math.cos((angle * Math.PI) / 180)
    const y = Math.sin((angle * Math.PI) / 180)

    points.push(`${50 + 50 * x}% ${50 + 50 * y}%`)
  }

  return `polygon(${points.join(', ')})`
}

PieChart.propTypes = {
  data: PropTypes.array.isRequired
}

export default PieChart
