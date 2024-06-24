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
  if (!data || data.length === 0 || !direction) return data

  const sortFunctions = {
    TimeSpent: (a, b) => (direction === 'desc' ? b.sessionTime - a.sessionTime : a.sessionTime - b.sessionTime),
    Date: (a, b) => (direction === 'desc' ? new Date(b.Date) - new Date(a.Date) : new Date(a.Date) - new Date(b.Date)),
    SiteName: (a, b) => (direction === 'desc' ? b.SiteName.localeCompare(a.SiteName) : a.SiteName.localeCompare(b.SiteName)),
    Earnings: (a, b) => (direction === 'desc' ? b.totalSilverAfterTaxes - a.totalSilverAfterTaxes : a.totalSilverAfterTaxes - b.totalSilverAfterTaxes),
    Loadout: (a, b) => (direction === 'desc' ? b.Loadout.name.localeCompare(a.Loadout.name) : a.Loadout.name.localeCompare(b.Loadout.name))
  }

  const sortFunction = sortFunctions[name]

  if (sortFunction) {
    return data.sort(sortFunction)
  }

  return data
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

    const url = 'api/user/sessions' + (queryString ? `?${queryString}` : '')

    const res = await authorizedFetch(url)
    const data = await res.json()
    return data
  } catch (error) {
    console.log('Failed to fetch history data:', error)
    return []
  }
}
