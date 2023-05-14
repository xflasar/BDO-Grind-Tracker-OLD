import React from 'react'
import { render, screen, act } from '@testing-library/react'
// import userEvent from '@testing-library/user-event' // added import statement
import History from '../pages/History/History'
import Cookies from 'js-cookie'

describe('History component', () => {
  test('renders "Add Session" button', async () => {
    Cookies.set('token', 'test')
    await act(async () => {
      render(<History />)
    })
    const addButton = screen.getByRole('button', { name: /Add session/i })
    expect(addButton).toBeInTheDocument()
    Cookies.remove('token')
  })
  // test commented out because it is not yet implemented
  // eslint-disable-next-line jest/no-commented-out-tests
  /* test('clicking "Add Session" button adds a new session row', () => {
    Cookies.set('token', 'test')
    render(<History />)
    const addButton = screen.getByRole('button', { name: /Add session/i })
    userEvent.click(addButton)
    const sessionRows = screen.getAllByRole('row')
    expect(sessionRows).toHaveLength(2) // default data has 2 rows
    Cookies.remove('token')
  }) */
})

describe('test fetch with mocked data and render of HistoryTable', () => {
  it('should render HistoryTable component when session token is present', async () => {
    const data = [
      {
        Date: 'Loading...',
        SiteName: 'Loading...',
        TimeSpent: 'Loading...',
        Earnings: 'Loading...',
        AverageEarnings: 'Loading...',
        Expenses: 'Loading...',
        Gear: 'Loading...'
      }
    ]

    jest.spyOn(global, 'fetch').mockImplementation(() =>
      Promise.resolve({
        json: () => Promise.resolve(data)
      })
    )

    Cookies.set('token', 'test')

    await act(async () => {
      render(<History />)
    })

    const historyTable = screen.getByRole('historyTable')

    expect(historyTable).toBeInTheDocument()

    Cookies.remove('token')
    global.fetch.mockRestore()
  })

  it('When session token is not present it should not show any siteBoxes', async () => {
    const container = render(<History />)
    await act(async () => container)

    const _boxes = await container.queryByRole('historyTable')

    expect(_boxes).toStrictEqual(null)
  })
})
