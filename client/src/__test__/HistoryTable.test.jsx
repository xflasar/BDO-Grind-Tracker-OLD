import React from 'react'
import { render, screen } from '@testing-library/react'
import HistoryTable from '../components/ui/HistoryTable'

describe('HistoryTable component', () => {
  const testData = [
    {
      Date: '2021-09-01',
      'Site Name': 'Site A',
      'Time Spent': '2h',
      Earnings: '$20',
      'Average Earnings': '$10',
      Expenses: '$5',
      Gear: 'Laptop'
    },
    {
      Date: '2021-09-02',
      'Site Name': 'Site B',
      'Time Spent': '3h',
      Earnings: '$30',
      'Average Earnings': '$10',
      Expenses: '$5',
      Gear: 'Desktop'
    }
  ]

  test('renders table headers', () => {
    render(<HistoryTable data={testData} />)
    const headers = screen.getAllByRole('columnheader')
    expect(headers).toHaveLength(7)
    expect(headers[0]).toHaveTextContent('Date')
    expect(headers[1]).toHaveTextContent('Site Name')
    expect(headers[2]).toHaveTextContent('Time Spent')
    expect(headers[3]).toHaveTextContent('Earnings')
    expect(headers[4]).toHaveTextContent('Average Earnings')
    expect(headers[5]).toHaveTextContent('Expenses')
    expect(headers[6]).toHaveTextContent('Gear')
  })

  test('renders table rows', () => {
    render(<HistoryTable data={testData} />)
    const rows = screen.getAllByRole('historyTableRow')
    expect(rows).toHaveLength(2) // header row + 2 data rows
  })
})
