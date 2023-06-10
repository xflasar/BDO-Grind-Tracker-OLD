import React from 'react'
import { render, screen } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import Homepage from '../pages/Home/Homepage'
import Cookies from 'js-cookie'
import { SessionProvider } from '../contexts/SessionContext'

describe('Homepage', () => {
  it('renders 5 boxes', () => {
    render(<SessionProvider><Homepage /></SessionProvider>)
    const _boxes = screen.getAllByText('No data!')
    expect(_boxes.length).toBe(5)
  })
})

describe('test fetch with mocked data', () => {
  it('When session token is present, it should set data to DataFromFetch!', async () => {
    const data = {
      Box1: { Title: 'Test', Content: 'DataE' },
      Box2: { Title: 'Test', Content: 'DataE' },
      Box3: { Title: 'Test', Content: 'DataE' },
      Box4: { Title: 'Test', Content: 'DataE' },
      Box5: { Title: 'Test', Content: 'DataE' }
    }

    jest.spyOn(global, 'fetch').mockImplementation(() =>
      Promise.resolve({
        json: () => Promise.resolve(data)
      })
    )

    // Set the session token in the cookies
    Cookies.set('token', 'test')
    await act(() => {
      render(<SessionProvider><Homepage /></SessionProvider>)
    })

    const _boxes = await screen.getAllByText('DataE')

    expect(_boxes.length).toBe(5)

    global.fetch.mockRestore()
  })

  it('When session token is not present it should set data of boxes to default No data!', async () => {
    await act(async () => { render(<SessionProvider><Homepage /></SessionProvider>) })

    const _boxes = await screen.getAllByText('No data!')

    expect(_boxes.length).toBe(5)

    const _boxesWithDataE = await screen.queryAllByText('DataE')

    expect(_boxesWithDataE.length).toBe(0)
  })
})
