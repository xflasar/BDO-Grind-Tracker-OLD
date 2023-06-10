import React from 'react'
import { render, screen, act } from '@testing-library/react'
// import userEvent from '@testing-library/user-event' // added import statement
import History from '../pages/History/History'
import Cookies from 'js-cookie'
import { SessionProvider } from '../contexts/SessionContext'

describe('History component', () => {
  test('renders "Add Session" button', async () => {
    Cookies.set('token', 'test')
    await act(async () => {
      render(<SessionProvider><History /></SessionProvider>)
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
    const data = [{
      _id: 'Loading..',
      Date: 'Loading...',
      SiteName: 'Loading...',
      TimeSpent: 'Loading...',
      Earnings: 'Loading...',
      AverageEarnings: 'Loading...',
      Expenses: 'Loading...',
      Gear: {
        TotalAP: 'Loading...',
        TotalDP: 'Loading...'
      }
    }]
    jest.spyOn(global, 'fetch').mockImplementation(async () => {
      try {
        const res = await Promise.resolve({
          json: async () => data // Assuming `data` is defined in the test scope
        }) // Log the parsed JSON data
        return await res
      } catch (error) {
        console.error('Failed to fetch history data:', error)
        return {
          json: async () => []
        }
      }
    })

    Cookies.set('token', 'test')

    const originalConsoleError = console.error
    const originalConsoleLog = console.log
    console.error = jest.fn()
    console.log = jest.fn()

    await act(async () => {
      render(<SessionProvider><History /></SessionProvider>)
    })

    const historyTable = screen.getByRole('historyTable')
    expect(historyTable).toBeInTheDocument()

    expect(console.error).not.toHaveBeenCalled()
    expect(console.log).not.toHaveBeenCalled()

    console.error = originalConsoleError
    console.log = originalConsoleLog

    Cookies.remove('token')
    global.fetch.mockRestore()
  })

  it('When session token is not present it should not show any siteBoxes', async () => {
    const container = render(<SessionProvider><History /></SessionProvider>)
    await act(async () => container)

    const _boxes = await container.queryByRole('historyTable')

    expect(_boxes).toStrictEqual(null)
  })
})
