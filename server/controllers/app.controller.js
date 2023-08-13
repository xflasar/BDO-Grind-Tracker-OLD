const SendEmail = require('../services/contactEmailsending.js')
const { emailConfig } = require('../config/emailSending.config.js')

exports.ContactSend = async (req, res) => {
  const { name, email, message } = req.body
  const messageToBeSent = `Name: ${name}\nEmail: ${email}\nMessage: ${message}`

  // Use args1 -> email to be set to, args2 -> subject, args3 -> message
  SendEmail(emailConfig.user, 'Contact Us', messageToBeSent)
    .then(() => {
      res.status(200).send()
    }).catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while sending email'
      })
    })
}
