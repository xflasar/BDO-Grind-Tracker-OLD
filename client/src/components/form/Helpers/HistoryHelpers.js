exports.formatEarnings = (earnings) => {
  return earnings.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

exports.formatSessionTime = (sessionTime) => {
  let stringB = ''

  const days = Math.floor(sessionTime / (24 * 60))
  if (days > 0) {
    sessionTime -= days * 24 * 60
    stringB += days + 'd '
  }
  const hours = Math.floor(sessionTime / 60)
  if (hours > 0) {
    sessionTime -= hours * 60
    stringB += hours + 'h '
  }
  const minutes = Math.floor(sessionTime)
  if (minutes > 0) {
    stringB += minutes + 'm'
  }

  return stringB
}

exports.sortData = (data, name, direction) => {
  if (!data || data.length === 0) return []
  if (!direction) return data

  switch (name) {
    case 'TimeSpent':
      if (direction === 'desc') {
        return data.sort((a, b) => {
          return b.sessionTime - a.sessionTime
        })
      } else if (direction === 'asc') {
        return data.sort((a, b) => {
          return a.sessionTime - b.sessionTime
        })
      }
      if (direction === 'desc') {
        return data.sort((a, b) => {
          return b.sessionTime - alert.sessionTime
        })
      } else if (direction === 'asc') {
        return data.sort((a, b) => {
          return a.sessionTime - b.sessionTime
        })
      }
      break
    case 'Date':
      if (direction === 'desc') {
        return data.sort((a, b) => new Date(b.Date) - new Date(a.Date))
      } else if (direction === 'asc') {
        return data.sort((a, b) => new Date(a.Date) - new Date(b.Date))
      }
      break
    case 'SiteName':
      if (direction === 'desc') {
        return data.sort((a, b) => {
          return b.SiteName.localeCompare(a.SiteName)
        })
      } else if (direction === 'asc') {
        return data.sort((a, b) => {
          return a.SiteName.localeCompare(b.SiteName)
        })
      }
      break
    case 'Earnings':
      if (direction === 'desc') {
        return data.sort((a, b) => {
          return b.totalSilverAfterTaxes - a.totalSilverAfterTaxes
        })
      } else if (direction === 'asc') {
        return data.sort((a, b) => {
          return a.totalSilverAfterTaxes - b.totalSilverAfterTaxes
        })
      }
      break
    case 'Loadout':
      if (direction === 'desc') {
        return data.sort((a, b) => {
          return b.Loadout.name.localeCompare(a.Loadout.name)
        })
      } else if (direction === 'asc') {
        return data.sort((a, b) => {
          return a.Loadout.name.localeCompare(b.Loadout.name)
        })
      }
      break
    default:
      return data
  }
}

exports.filterData = (data, selection) => {
  return data.filter((a) => a.SiteName === selection)
}

exports.fetchData = async (pagination, authorizedFetch) => {
  try {
    // Build the query string dynamically
    const queryString = Object.entries(pagination)
      .filter(([key, value]) => value !== undefined)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&')

    const url = 'api/user/historydata' + (queryString ? `?${queryString}` : '')

    const res = await authorizedFetch(url)
    const data = await res.json()
    return data
  } catch (error) {
    console.log('Failed to fetch history data:', error)
    return []
  }
}
