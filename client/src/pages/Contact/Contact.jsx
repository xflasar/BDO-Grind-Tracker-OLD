import React, { useState } from 'react'
import '../../assets/pages/Contact/Contact.scss'

// WIP
// TODO:
// - Add validation (Depends)
// - response Errors
// - response Success
// - We might not need even API just give user mailto

const Contact = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [responseMessage, setResponseMessage] = useState('')
  const [responseError, setResponseError] = useState(false)
  const [responseStatus, setResponseStatus] = useState(false)

  const postData = async () => {
    const response = await fetch('/api/contactsend', {
      method: 'POST',
      body: JSON.stringify({
        name,
        email,
        message
      })
    })
    if (response.ok) {
      const res = await response.json()
      setResponseMessage(res)
      console.log(res)
      setName('')
      setEmail('')
      setMessage('')
    } else {
      setResponseMessage('Something went wrong')
      setResponseError(true)
    }
    setResponseStatus(true)
    /* setTimeout(() => {
      setResponseStatus(false)
    }, 3000) */
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
            {responseStatus ? <label className={responseError ? 'contact-form-content-bottom-response-message error' : 'contact-form-content-bottom-response-message'}>{responseMessage}</label> : null}
            <button type="button" onClick={(e) => handleContactSubmit(e)}>Send Email</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Contact
