import React from 'react'
import '../../../../assets/components/ui/Homepage/SessionSummaryGraph.scss'
import PieChart from '../../../helpers/Graph/PieChart'

const SessionSummaryGraph = () => {
  const sampleData = [
    {
      name: 'Site 1',
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
    }
  ]

  return (
    <div className="siteGraph">
      <h1>Site Graph</h1>
      <PieChart data={sampleData} />
      <div className='siteGraph-legend'>
        {sampleData.map((item, index) => {
          return <span key={index} style={{ color: item.color }}>{item.name}</span>
        })}
      </div>
    </div>
  )
}

export default SessionSummaryGraph
