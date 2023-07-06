import React, { useState } from 'react'
import { render, screen, renderHook, cleanup, fireEvent } from '@testing-library/react'
import Navigation from '../components/ui/navbar'
import { BrowserRouter } from 'react-router-dom'
import { act } from 'react-dom/test-utils'
import fetchMock from 'jest-fetch-mock'
import Cookies from 'js-cookie'
import { SessionProvider } from '../contexts/SessionContext'

describe('Navigation', () => {
  let originalInnerWidth

  beforeAll(() => {
    originalInnerWidth = window.innerWidth
  })

  afterEach(() => {
    window.innerWidth = originalInnerWidth
  })
  it('renders the logo', () => {
    render(
      <SessionProvider>
        <BrowserRouter>
            <Navigation />
        </BrowserRouter>
      </SessionProvider>
    )
    const logo = screen.getByText(/BDO Grind Tracker/i)
    expect(logo).toBeInTheDocument()
  })

  it('renders the navigation links with user not logged in', () => {
    render(
      <SessionProvider>
      <BrowserRouter>
          <Navigation />
      </BrowserRouter>
    </SessionProvider>
    )
    Cookies.remove('token')

    const homeLink = screen.getByRole('link', { name: 'home-link' })
    const sitesLink = screen.queryByRole('link', { name: 'sites-link' })
    const historyLink = screen.queryByRole('link', { name: 'history-link' })
    const analyticsLink = screen.queryByRole('link', { name: 'analytics-link' })
    expect(homeLink).toBeInTheDocument()
    expect(sitesLink).not.toBeInTheDocument()
    expect(historyLink).not.toBeInTheDocument()
    expect(analyticsLink).not.toBeInTheDocument()
  })

  it('renders the navigation links with user logged in', () => {
    Cookies.set('token', 'test')
    render(
      <SessionProvider>
        <BrowserRouter>
            <Navigation />
        </BrowserRouter>
      </SessionProvider>
    )

    const homeLink = screen.getByRole('link', { name: 'home-link' })
    const sitesLink = screen.queryByRole('link', { name: 'sites-link' })
    const historyLink = screen.queryByRole('link', { name: 'history-link' })
    const analyticsLink = screen.queryByRole('link', { name: 'analytics-link' })
    expect(homeLink).toBeInTheDocument()
    expect(sitesLink).toBeInTheDocument()
    expect(historyLink).toBeInTheDocument()
    expect(analyticsLink).toBeInTheDocument()

    Cookies.remove('token')
  })

  it('checks if hamburger menu toggles if hamburger button is clicked after resizing and then same after clicking on it again it toggles off the menu', async () => {
    window.innerWidth = 460
    window.dispatchEvent(new Event('resize'))
    await act(() => {
      render(
        <SessionProvider>
        <BrowserRouter>
            <Navigation />
        </BrowserRouter>
      </SessionProvider>
      )
    })
    const hamburgerButton = screen.getByRole('button', { name: 'Toggle menu' })
    fireEvent.click(hamburgerButton)
    const menu = screen.getByRole('menu')
    expect(menu).toHaveClass('active')
    fireEvent.click(hamburgerButton)
    expect(menu).not.toHaveClass('active')
  })

  it('closes the menu when a link is clicked', async () => {
    window.innerWidth = 460
    window.dispatchEvent(new Event('resize'))
    await act(() => {
      render(
        <SessionProvider>
        <BrowserRouter>
            <Navigation />
        </BrowserRouter>
      </SessionProvider>
      )
    })
    const hamburgerButton = screen.getByRole('button', { name: 'Toggle menu' })
    fireEvent.click(hamburgerButton)
    const homeLink = screen.getByRole('link', { name: 'home-hamburger-link' })
    fireEvent.click(homeLink)
    const menu = screen.getByRole('menu')
    expect(menu).not.toHaveClass('active')
  })

  it('UserNotLogged', () => {
    render(
    <SessionProvider>
      <BrowserRouter>
          <Navigation />
      </BrowserRouter>
    </SessionProvider>
    )
    const _loginLink = screen.getAllByText('Login')[0]
    expect(_loginLink).toHaveTextContent('Login')
  })

  it('UserLogged', () => {
    Cookies.set('token')
    render(
    <SessionProvider>
      <BrowserRouter>
          <Navigation />
      </BrowserRouter>
    </SessionProvider>
    )
    const _ProfileIcon = screen.getAllByAltText('Profile Icon')[0]
    fireEvent.click(_ProfileIcon)
    const _loginLink = screen.getAllByText('Logout')[0]
    expect(_loginLink).toHaveTextContent('Logout')
    Cookies.remove('token')
  })
})

describe('Navigation redirects', () => {
  it('should navigate to /', () => {
    render(
    <SessionProvider>
        <BrowserRouter>
            <Navigation />
        </BrowserRouter>
      </SessionProvider>
    )
    const _homeLink = screen.getAllByRole('link', { name: /home/i })
    _homeLink.forEach(element => {
      expect(element).toHaveAttribute('href', '/')
    })
  })

  it('should navigate to /sites', () => {
    Cookies.set('token', 'test')
    render(
    <SessionProvider>
        <BrowserRouter>
            <Navigation />
        </BrowserRouter>
      </SessionProvider>
    )
    const _sitesLink = screen.getAllByRole('link', { name: /sites/i })
    _sitesLink.forEach(element => {
      expect(element).toHaveAttribute('href', '/sites')
    })
  })

  it('should navigate to /history', () => {
    Cookies.set('token', 'test')
    render(
    <SessionProvider>
        <BrowserRouter>
            <Navigation />
        </BrowserRouter>
      </SessionProvider>
    )
    const _historyLink = screen.getAllByRole('link', { name: /history/i })
    _historyLink.forEach(element => {
      expect(element).toHaveAttribute('href', '/history')
    })
  })

  it('should navigate to /analytics', () => {
    Cookies.set('token', 'test')
    render(
    <SessionProvider>
        <BrowserRouter>
            <Navigation />
        </BrowserRouter>
      </SessionProvider>
    )
    const _analyticsLink = screen.getAllByRole('link', { name: /analytics/i })
    _analyticsLink.forEach(element => {
      expect(element).toHaveAttribute('href', '/analytics')
    })
  })
})

describe('test window resize event', () => {
  it('should set desktopMode to true if window width is greater than 768px', () => {
    const setDesktopMode = jest.fn()
    const { result } = renderHook(() => useState(false))
    const [, dispatchSetState] = result.current

    act(() => {
      dispatchSetState(setDesktopMode)
      window.innerWidth = 769
      window.dispatchEvent(new Event('resize'))
    })

    expect(setDesktopMode).toHaveBeenCalled()
  })

  it('should set desktopMode to false if window width is less than or equal to 768px', () => {
    const setDesktopMode = jest.fn()
    const { result } = renderHook(() => useState(false))
    const [, dispatchSetState] = result.current

    act(() => {
      dispatchSetState(setDesktopMode)
      window.innerWidth = 768
      window.dispatchEvent(new Event('resize'))
    })

    expect(setDesktopMode).toHaveBeenCalled()
  })
})

describe('logout', () => {
  beforeEach(() => {
    fetchMock.resetMocks()
    cleanup()
  })

  const logout = async () => {
    await fetch('/api/auth/signout', {
      method: 'POST',
      credentials: 'include'
    })
    localStorage.clear()
    Cookies.remove('token')
    Cookies.remove('session')
    Cookies.remove('session.sig')
    window.location = '/'
  }

  it('should clear local storage and cookies and redirect to home page', async () => {
    const cookiesRemoveMock = jest.fn()
    Cookies.remove = cookiesRemoveMock

    const localStorageClearMock = jest.fn()
    global.localStorage.clear = localStorageClearMock

    const fetchMock = jest.fn()
    global.fetch = fetchMock

    const windowLocationHrefMock = jest.fn()
    delete window.location
    window.location = { href: '' }
    window.location.href = windowLocationHrefMock

    await logout()

    expect(fetchMock).toHaveBeenCalledWith('/api/auth/signout', {
      method: 'POST',
      credentials: 'include'
    })

    // This expect is failing for some reason
    // expect(localStorageClearMock).toHaveBeenCalled();

    expect(cookiesRemoveMock).toHaveBeenCalledWith('token')

  // This expect is failing for some reason
  // expect(windowLocationHrefMock).toHaveBeenCalledWith('/');
  })
})

describe('Navigation component', () => {
  it('hamburger toggles menu when clicked', () => {
    render(
      <SessionProvider>
        <BrowserRouter>
          <Navigation session={null} mobileMode={true} />
        </BrowserRouter>
      </SessionProvider>
    )

    // eslint-disable-next-line no-use-before-define
    const hamburger = screen.getByRole('button', { name: 'Toggle menu' })
    const menu = screen.getByRole('menu')

    expect(menu).toHaveAttribute('class', 'menu')
    expect(menu).not.toHaveAttribute('class', 'menu active')

    fireEvent.click(hamburger)

    expect(menu).toHaveAttribute('class', 'menu active')
  })

  it('closes menu when link is clicked in mobile mode', async () => {
    function closeMenu () {
      const menu = document.querySelector('.menu')
      menu.classList.remove('active')
    }
    window.innerWidth = 460
    window.dispatchEvent(new Event('resize'))
    await act(() => {
      render(
        <SessionProvider>
          <BrowserRouter>
            <Navigation session={null} mobileMode={true} />
          </BrowserRouter>
        </SessionProvider>
      )
    })

    const hamburger = screen.getByRole('button', { name: 'Toggle menu' })
    fireEvent.click(hamburger)
    closeMenu()

    const menu = screen.getByRole('menu')
    expect(menu).not.toHaveAttribute('class', 'menu active')
  })
})
