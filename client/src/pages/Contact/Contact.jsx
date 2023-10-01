import React, { useState } from 'react'
import '../../assets/pages/Contact/Contact.scss'

// WIP
// TODO:
// - Add validation (Depends)
// - We might not need even API just give user mailto
// - rework from useState to useReducer
// - Styles

const Contact = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [responseMessage, setResponseMessage] = useState('')
  const [responseStatus, setResponseStatus] = useState(false)
  const [responseStatusError, setResponseStatusError] = useState(false)

  const postData = async () => {
    const response = await fetch('/api/contactsend', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name,
        email,
        message
      })
    })
    if (response.ok) {
      setResponseMessage('Thank you for contacting us.')
      setResponseStatusError(false)
      setName('')
      setEmail('')
      setMessage('')
    } else {
      const res = await response.json()
      setResponseMessage(res.message ? 'Something went wrong. ' + res.message : 'Something went wrong. Please try again later.')
      setResponseStatusError(true)
    }
    setResponseStatus(true)
    setTimeout(() => {
      setResponseStatus(false)
    }, 3000)
  }

  const handleContactSubmit = (e) => {
    e.preventDefault()
    console.log(name, email, message)
    postData()
  }

  const handleNameChange = (e) => {
    setName(e.target.value)
  }

  const handleEmailChange = (e) => {
    setEmail(e.target.value)
  }

  const handleMessageChange = (e) => {
    setMessage(e.target.value)
  }

  return (
    <div className="contact-form-container">
      <h1>Contact Us</h1>
      <div className='contact-form-content'>
        <form>
          <div className='contact-form-content-leftside'>
            <label htmlFor="name">Name:</label>
            <input type="text" id="name" name="name" value={name} onChange={handleNameChange} required />
            <br />
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" name="email" value={email} onChange={handleEmailChange} required />
            <br />
          </div>
          <div className='contact-form-content-rightside'>
            <label htmlFor="message">Message:</label>
            <textarea id="message" name="message" rows="6" value={message} onChange={handleMessageChange} required></textarea>
            <br />
          </div>
          <div className='contact-form-content-bottom'>
            {responseStatus ? <label className={responseStatusError ? 'contact-form-content-bottom-response-message error' : 'contact-form-content-bottom-response-message'}>{responseMessage}</label> : null}
            <button type="button" onClick={(e) => handleContactSubmit(e)}>Send Email</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Contact
