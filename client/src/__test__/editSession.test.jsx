import React from 'react'
import { render, fireEvent, act, screen } from '@testing-library/react'
import EditSession from '../components/form/editSession'

describe('EditSession', () => {
  const mockData = {
    _id: 'session_id',
    Date: '01/01/2023',
    SiteName: 'Test Site',
    TimeSpent: '60',
    Earnings: '100',
    AverageEarnings: '50',
    Expenses: '10',
    Gear: {
      TotalAP: '120',
      TotalDP: '80'
    }
  }

  const mockCallbacks = {
    onEditSuccess: jest.fn(),
    onEditSessionSubmit: jest.fn(),
    onCloseClick: jest.fn()
  }

  test('renders EditSession form correctly', async () => {
    await act(async () => {
      render(
      <EditSession data={mockData} {...mockCallbacks} />
      )
    })

    const sessionEditForm = screen.getByRole('form', { 'aria-label': 'sessionEditForm' })
    const sessionEditExitButton = screen.getByRole('button', { name: 'sessionEditExitButton' })
    const Date = screen.getByLabelText('Date')
    const SiteName = screen.getByLabelText('Site Name')
    const TimeSpent = screen.getByLabelText('Time Spent')
    const Earnings = screen.getByLabelText('Earnings')
    const AverageEarnings = screen.getByLabelText('Average Earnings')
    const Expenses = screen.getByLabelText('Expenses')
    const TotalAP = screen.getByLabelText('Total AP')
    const TotalDP = screen.getByLabelText('Total DP')
    const sessionEditSubmitButton = screen.getByRole('button', { name: 'sessionEditSubmitButton' })

    expect(sessionEditForm).toBeInTheDocument()
    expect(sessionEditExitButton).toBeInTheDocument()
    expect(Date).toBeInTheDocument()
    expect(SiteName).toBeInTheDocument()
    expect(TimeSpent).toBeInTheDocument()
    expect(Earnings).toBeInTheDocument()
    expect(AverageEarnings).toBeInTheDocument()
    expect(Expenses).toBeInTheDocument()
    expect(TotalAP).toBeInTheDocument()
    expect(TotalDP).toBeInTheDocument()
    expect(sessionEditSubmitButton).toBeInTheDocument()
  })

  test('calls onEditSessionSubmit and onEditSuccess when form is submitted', async () => {
    await act(() => {
      render(
            <EditSession data={mockData} {...mockCallbacks} />
      )
    })

    const Date = screen.getByLabelText('Date')
    const SiteName = screen.getByLabelText('Site Name')
    const TimeSpent = screen.getByLabelText('Time Spent')
    const Earnings = screen.getByLabelText('Earnings')
    const AverageEarnings = screen.getByLabelText('Average Earnings')
    const Expenses = screen.getByLabelText('Expenses')
    const TotalAP = screen.getByLabelText('Total AP')
    const TotalDP = screen.getByLabelText('Total DP')
    const sessionEditSubmitButton = screen.getByRole('button', { name: 'sessionEditSubmitButton' })

    fireEvent.change(Date, { target: { value: '2023-01-01' } })
    fireEvent.change(SiteName, { target: { value: 'Updated Site' } })
    fireEvent.change(TimeSpent, { target: { value: '154' } })
    fireEvent.change(Earnings, { target: { value: '155' } })
    fireEvent.change(AverageEarnings, { target: { value: '156' } })
    fireEvent.change(Expenses, { target: { value: '157' } })
    fireEvent.change(TotalAP, { target: { value: '158' } })
    fireEvent.change(TotalDP, { target: { value: '159' } })

    fireEvent.click(sessionEditSubmitButton)

    expect(mockCallbacks.onEditSessionSubmit).toHaveBeenCalledTimes(1)
    expect(mockCallbacks.onEditSuccess).toHaveBeenCalledTimes(1)
  })

  test('calls onCloseClick when close button is clicked', async () => {
    await act(() => {
      render(
        <EditSession data={mockData} {...mockCallbacks} />
      )
    })

    const sessionEditExitButton = screen.getByRole('button', { name: 'sessionEditExitButton' })

    fireEvent.click(sessionEditExitButton)

    expect(mockCallbacks.onCloseClick).toHaveBeenCalledTimes(1)
  })
})
