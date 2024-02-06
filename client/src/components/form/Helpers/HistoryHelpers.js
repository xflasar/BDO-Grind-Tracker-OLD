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
