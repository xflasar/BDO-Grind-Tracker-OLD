exports.PostFetch = async (url, options) => {
  try {
    const response = await fetch(url, options)
    return handleFetch(response)
  } catch (error) {
    console.log('Failed to fetch POST request ', error)
  }
}

exports.GetFetch = async (url) => {
  try {
    const response = await fetch(url)
    return handleFetch(response)
  } catch (error) {
    console.log('Failed to fetch GET request ', error)
  }
}

const handleFetch = async (response) => {
  if (response.status === 404) {
    return ''
  } else if (response.ok) {
    const res = await response.json()
    if (!res) {
      return 'Empty data!'
    }
    return res
  }
}
