import React from 'react'
import { render, screen, fireEvent, act } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import AddSession from '../components/form/AddSession/addSession'
import { SessionProvider } from '../contexts/SessionContext'

describe('AddSession Component', () => {
  const onAddSessionSuccessMock = jest.fn()
  const onCloseClickMock = jest.fn()

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should render the form correctly', async () => {
    await act(() => {
      render(
        <SessionProvider>
          <AddSession onAddSessionSuccess={onAddSessionSuccessMock} onCloseClick={onCloseClickMock}/>
        </SessionProvider>
      )
    })

    const addSessionExitButton = screen.getByRole('button', { name: 'addSessionExitButton' })
    const siteName = screen.getByLabelText('Site Name')
    const timeSpent = screen.getByLabelText('Time Spent')
    const earnings = screen.getByLabelText('Earnings')
    const averageEarnings = screen.getByLabelText('Average Earnings')
    const expenses = screen.getByLabelText('Expenses')
    const totalAP = screen.getByLabelText('TotalAP')
    const totalDP = screen.getByLabelText('TotalDP')
    const addSessionSubmitButton = screen.getByRole('button', { name: 'addSessionSubmitButton' })

    expect(addSessionExitButton).toBeInTheDocument()
    expect(siteName).toBeInTheDocument()
    expect(timeSpent).toBeInTheDocument()
    expect(earnings).toBeInTheDocument()
    expect(averageEarnings).toBeInTheDocument()
    expect(expenses).toBeInTheDocument()
    expect(totalAP).toBeInTheDocument()
    expect(totalDP).toBeInTheDocument()
    expect(addSessionSubmitButton).toBeInTheDocument()
  })

  it('should call the onCloseClick function when the close button is clicked', async () => {
    await act(() => {
      render(
        <SessionProvider>
          <AddSession onAddSessionSuccess={onAddSessionSuccessMock} onCloseClick={onCloseClickMock}/>
        </SessionProvider>
      )
    })

    const closeButton = screen.getByRole('button', { name: 'addSessionExitButton' })

    fireEvent.click(closeButton)

    expect(onCloseClickMock).toHaveBeenCalledWith(false)
  })

  it('should call the fetch and then if successful call onAddSessionSuccess function with the data fetched when the form is submitted', async () => {
    const mockResponse = {
      SiteName: 'Example Site',
      TimeSpent: '10',
      TotalEarned: '100',
      AverageEarnings: '50',
      TotalSpent: '20',
      AP: '150',
      DP: '120'
    }

    jest.spyOn(global, 'fetch').mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockResponse)
    })

    await act(async () => {
      render(
        <SessionProvider>
          <AddSession onAddSessionSuccess={onAddSessionSuccessMock} onCloseClick={onCloseClickMock}/>
        </SessionProvider>
      )
    })

    const siteNameInput = screen.getByLabelText('Site Name')
    const timeSpentInput = screen.getByLabelText('Time Spent')
    const earningsInput = screen.getByLabelText('Earnings')
    const averageEarningsInput = screen.getByLabelText('Average Earnings')
    const expensesInput = screen.getByLabelText('Expenses')
    const totalAPInput = screen.getByLabelText('TotalAP')
    const totalDPInput = screen.getByLabelText('TotalDP')
    const addSessionSubmitButton = screen.getByRole('button', { name: 'addSessionSubmitButton' })

    fireEvent.change(siteNameInput, { target: { value: 'Example Site' } })
    fireEvent.change(timeSpentInput, { target: { value: '10' } })
    fireEvent.change(earningsInput, { target: { value: '100' } })
    fireEvent.change(averageEarningsInput, { target: { value: '50' } })
    fireEvent.change(expensesInput, { target: { value: '20' } })
    fireEvent.change(totalAPInput, { target: { value: '150' } })
    fireEvent.change(totalDPInput, { target: { value: '120' } })
    fireEvent.click(addSessionSubmitButton)

    expect(fetch).toHaveBeenCalledWith('api/user/addsession', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        SiteName: 'Example Site',
        TimeSpent: '10',
        TotalEarned: '100',
        AverageEarnings: '50',
        TotalSpent: '20',
        AP: '150',
        DP: '120'
      })
    })
    await act(async () => {
      await Promise.resolve()
    })

    expect(onAddSessionSuccessMock).toHaveBeenCalledWith({
      Data: mockResponse,
      setAddSession: false
    })

    global.fetch.mockRestore()
  })
})
