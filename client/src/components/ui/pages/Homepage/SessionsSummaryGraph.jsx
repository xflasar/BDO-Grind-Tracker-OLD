import React from 'react'
import '../../../../assets/components/ui/Homepage/SessionSummaryGraph.scss'
import PieChart from '../../../helpers/Graph/PieChart'

const SessionSummaryGraph = () => {
  const sampleData = [
    {
      name: 'Sycraia Abyssal Ruins',
      value: 10,
      color: 'green'
    },
    {
      name: 'Site 2',
      value: 20,
      color: 'blue'
    },
    {
      name: 'Site 3',
      value: 30,
      color: 'orange'
    },
    {
      name: 'Site 4',
      value: 40,
      color: 'pink'
    },
    {
      name: 'Site 5',
      value: 15,
      color: 'white'
    },
    {
      name: 'Site 6',
      value: 25,
      color: 'orange'
    },
    {
      name: 'Site 7',
      value: 33,
      color: 'purple'
    }
  ]

  return (
    <div className="siteGraph">
      <h1>Site Graph</h1>
      <PieChart data={sampleData} />
      <div className='siteGraph-legend'>
        <div className='siteGraph-legend-text'>
        {sampleData.map((item, index) => {
          return <span key={index} style={{ color: item.color }}>{item.name}</span>
        })}
        </div>
        <div className='siteGraph-legend-textgraph'>
          {sampleData.map((item, index) => {
            // inefficient
            const highestPercentage = Math.max(...sampleData.map(x => x.value))
            console.log(highestPercentage)

            const width = (item.value / highestPercentage) * 100

            return (
              <div key={index} className='item' style={{ color: item.color }}>
                <div className='item-graphical' style={{ backgroundColor: item.color, width: `${width}%` }}/>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default SessionSummaryGraph
