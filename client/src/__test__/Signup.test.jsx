import React from 'react'
import { render, fireEvent, waitFor, act, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import Signup from '../components/form/Signup'

describe('Signup Component', () => {
  it('should render the signup form', async () => {
    const onSignupSuccess = jest.fn()
    await act(async () => {
      render(
        <Signup onSignupSuccess={onSignupSuccess} />
      )
    })

    const signupForm = screen.getByRole('form', { 'aria-label': 'signup-container-form' })
    const usernameInput = screen.getByPlaceholderText('Username')
    const emailInput = screen.getByPlaceholderText('Email')
    const passwordInput = screen.getByPlaceholderText('Password')
    const signupButton = screen.getByRole('button', { 'aria-label': 'signup-button' })

    expect(signupForm).toBeInTheDocument()
    expect(usernameInput).toBeInTheDocument()
    expect(emailInput).toBeInTheDocument()
    expect(passwordInput).toBeInTheDocument()
    expect(signupButton).toBeInTheDocument()
  })

  it('should handle signup form submission', async () => {
    const onSignupSuccess = jest.fn()
    const mockAccessToken = 'mock-access-token'
    const mockResponse = { accessToken: mockAccessToken }
    const fetchMock = jest.spyOn(global, 'fetch').mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockResponse)
    })
    await act(async () => {
      render(
        <Signup onSignupSuccess={onSignupSuccess} />
      )
    })

    const usernameInput = screen.getByPlaceholderText('Username')
    const emailInput = screen.getByPlaceholderText('Email')
    const passwordInput = screen.getByPlaceholderText('Password')
    const signupButton = screen.getByText('Register')

    fireEvent.change(usernameInput, { target: { value: 'testuser' } })
    fireEvent.change(emailInput, { target: { value: 'testemail@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'testpassword' } })
    fireEvent.click(signupButton)

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(1)
      expect(fetchMock).toHaveBeenCalledWith('api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: 'testuser',
          email: 'testemail@example.com',
          password: 'testpassword'
        })
      })
      expect(document.cookie).toBe(`token=${mockAccessToken}`)
      expect(onSignupSuccess).toHaveBeenCalledTimes(1)
      expect(onSignupSuccess).toHaveBeenCalledWith(mockAccessToken)
    })

    fetchMock.mockRestore()
  })
})
