import React from 'react'
import '../../../../assets/components/ui/Homepage/SessionSummaryGraph.scss'
import PieChart from '../../../helpers/Graph/PieChart'

const SessionSummaryGraph = () => {
  const sampleData = [
    {
      name: 'Session 1',
      value: 10
    },
    {
      name: 'Session 2',
      value: 20
    },
    {
      name: 'Session 3',
      value: 30
    },
    {
      name: 'Session 4',
      value: 40
    }
  ]

  return (
    <div className="SessionSummaryGraph">
      <div>SessionSummaryGraph</div>
      <PieChart data={sampleData} />
    </div>
  )
}

export default SessionSummaryGraph
