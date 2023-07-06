const APIKey = '6d207e02198a847aa98d0a2a901485a5'

// Make a request to the FreeImage Host API using the APIKey and image64encoded
const UploadImage = async (image64encoded) => {
  const formData = new FormData()
  formData.append('key', APIKey)
  formData.append('source', image64encoded)
  formData.append('format', 'json')

  try {
    const response = await fetch('https://freeimage.host/api/1/upload', {
      method: 'POST',
      body: formData
    })
    if (response.ok) {
      const data = await response.json()
      return data
    } else {
      console.log('Response not ok!')
    }
  } catch (error) {
    console.log(error)
  }
}

module.exports = { UploadImage }
