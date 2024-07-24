const nodemailer = require('nodemailer')
const { emailConfig } = require('../config/emailSending.config')

exports.sendVerifyEmail = (recipent, verificationCode) => {
  // Create a transporter
  let transporter = nodemailer.createTransport({
    service: 'Gmail',
    host: 'smtp.gmail.com',
    port: 465,
    auth: {
      type: 'login',
      user: emailConfig.user,
      pass: emailConfig.pass
    }
  })

  // Email options
  let mailOptions = {
    from: emailConfig.user,
    to: recipent,
    subject: 'Email Verification',
    html: `<!DOCTYPE html>
    <html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
        <meta name="format-detection" content="telephone=no"> 
        <meta name="viewport" content="width=device-width; initial-scale=1.0; maximum-scale=1.0; user-scalable=no;">
        <meta http-equiv="X-UA-Compatible" content="IE=9; IE=8; IE=7; IE=EDGE" />
        <title>Email verification</title>
        <style>
            /* Some resets and issue fixes */
            #outlook a { padding:0; }
            body{ width:100% !important; -webkit-text; size-adjust:100%; -ms-text-size-adjust:100%; margin:0; padding:0; }     
            .ReadMsgBody { width: 100%; }
            .ExternalClass {width:100%;} 
            .backgroundTable {margin:0 auto; padding:0; width:100%;!important;} 
            table td {border-collapse: collapse;}
            .ExternalClass * {line-height: 115%;}           
            /* End reset */
            
            @import url(http://fonts.googleapis.com/css?family=Roboto:300); /*Calling our web font*/
            
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: rgba(32, 28, 38);
              border-radius: 8px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            .header {
              background-color: rgba(51, 51, 51);
              color: #ffa600;
              padding: 10px 20px;
              text-align: center;
              border-top-left-radius: 8px;
              border-top-right-radius: 8px;
            }
            .content {
              padding: 20px;
              color: rgb(255, 94, 0);
            }
            .footer {
              background-color: rgba(51, 51, 51);
              color: #ffa600;
              text-align: center;
              padding: 10px;
              border-bottom-left-radius: 8px;
              border-bottom-right-radius: 8px;
            }
            .verification-code {
              font-size: 24px;
              font-weight: bold;
              color: #ffa600;
              text-align: center;
              margin: 20px 0;
            }
        </style>
    </head>
    <body style="padding:0; margin:0; background-color: #f4f4f4;">
        <table border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
                <td align="center" valign="top" style="padding: 20px 0;">
                    <table class="container" border="0" cellpadding="0" cellspacing="0" width="600">
                        <tr>
                            <td class="header" style="padding: 20px 0; text-align: center; background-color: rgba(51, 51, 51); color: #ffa600;">
                                <h1 style="margin: 0; font-size: 24px;">Email Verification</h1>
                            </td>
                        </tr>
                        <tr>
                            <td class="content" style="padding: 20px; background-color: rgba(32, 28, 38); color: rgb(255, 94, 0);">
                                <p style="margin: 0 0 20px;">Dear User,</p>
                                <p style="margin: 0 0 20px;">Thank you for registering. To complete your registration, please use the verification code below:</p>
                                <div class="verification-code" style="margin: 20px 0; font-size: 24px; font-weight: bold; text-align: center; color: #ffa600;">
                                    ${verificationCode}
                                </div>
                                <p style="margin: 0 0 20px;">If you did not request this, please ignore this email.</p>
                                <p style="margin: 0;">Thank you!</p>
                            </td>
                        </tr>
                        <tr>
                            <td class="footer" style="padding: 20px 0; text-align: center; background-color: rgba(51, 51, 51); color: #ffa600;">
                                <p style="margin: 0;">&copy; 2024 BDO-Grind-Tracker by Martin Flasar</p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    `
  }

  // Send email
  const state = transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      return false
    }
    console.log('Message sent: %s', info.messageId);
    return true
  })
  return state
}