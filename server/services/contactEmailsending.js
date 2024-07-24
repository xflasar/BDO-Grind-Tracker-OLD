const nodemailer = require('nodemailer')
const { emailConfig } = require('../config/emailSending.config.js')

const SendEmail = (recipient, subject, content) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    host: 'smtp.gmail.com',
    port: 465,
    auth: {
      type: 'login',
      user: emailConfig.user,
      pass: emailConfig.pass
    }
  })
  transporter.verify().then(console.log).catch(console.error)
  const mailOptions = {
    from: emailConfig.user,
    to: recipient,
    subject,
    html: content
  }
  return transporter.sendMail(mailOptions).then().catch(console.error)
}

module.exports = SendEmail
