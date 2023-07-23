import React from 'react'
import { render, fireEvent, waitFor, act, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import Login from '../components/form/Login/Login'
import { SessionProvider } from '../contexts/SessionContext'

describe('Login Component', () => {
  it('should render the login form', async () => {
    const onLoginSuccess = jest.fn()
    await act(async () => {
      render(
        <SessionProvider><Login onLoginSuccess={onLoginSuccess} /></SessionProvider>
      )
    })
    const loginContainer = screen.getByRole('form', { 'aria-label': 'login-container-form' })
    expect(loginContainer).toBeInTheDocument()
  })

  it('should handle login form submission', async () => {
    const onLoginSuccess = jest.fn()
    const mockAccessToken = 'mock-access-token'
    const mockResponse = { accessToken: mockAccessToken }
    const fetchMock = jest.spyOn(global, 'fetch').mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockResponse)
    })
    await act(async () => {
      render(
        <SessionProvider><Login onLoginSuccess={onLoginSuccess} /></SessionProvider>
      )
    })

    const usernameInput = screen.getByRole('textbox', { 'aria-label': 'username' })
    const passwordInput = screen.getByLabelText('password')
    const loginButton = screen.getByRole('button', { 'arial-label': 'loginButton' })

    fireEvent.change(usernameInput, { target: { value: 'testuser' } })
    fireEvent.change(passwordInput, { target: { value: 'testpassword' } })
    fireEvent.click(loginButton)

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(1)
      expect(fetchMock).toHaveBeenCalledWith('api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: 'testuser',
          password: 'testpassword'
        })
      })
      expect(document.cookie).toBe(`token=${mockAccessToken}`)
      expect(onLoginSuccess).toHaveBeenCalledTimes(1)
    })

    fetchMock.mockRestore()
  })
})
