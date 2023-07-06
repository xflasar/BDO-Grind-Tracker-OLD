const express = require('express')
const cors = require('cors')
const cookieSession = require('cookie-session')
const dbConfig = require('./config/db.config')
const db = require('mongoose')
const https = require('https')
const http = require('http')
const fs = require('fs')
const path = require('path')

const app = express()
const port = process.env.PORT || 443

const corsOptions = {
  origin: 'http://localhost:3000'
}

// #region SETUP
app.use(cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieSession({
  name: 'session',
  secret: 'COOKIE_SECRET',
  httpOnly: true
}))

app.use(function (req, res, next) {
  if (req.headers['x-forwarded-proto'] === 'http') {
    return res.redirect('https://' + req.headers.host + req.url)
  } else {
    return next()
  }
})
// #endregion

const key = fs.readFileSync(path.join(__dirname, '/config/selfsigned.key'))
const cert = fs.readFileSync(path.join(__dirname, '/config/selfsigned.crt'))

// #region ROUTES
require('./routes/auth.routes')(app)
require('./routes/user.routes')(app)
// #endregion

// #region DATABASE
db.mongoose.connect(`mongodb+srv://${dbConfig.username}:${dbConfig.password}@bdogrindtracker.mqzvwfp.mongodb.net/?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => { console.log('Successfully connected to MongoDB.') }).catch(err => { console.error('Connection error', err); process.exit() })
// #endregion

// #region API_CALLS
// Main API call
app.get('/api', (req, res) => {
  res.redirect('http://localhost:3000/')
  console.log('Server received API check request!')
})

// #endregion

http.createServer(app)
https.createServer({ key, cert }, app).listen(port, () => { console.log(`Server listening on port ${443}!`) })
