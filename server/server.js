const express = require('express')
const cors = require('cors')
const cookieSession = require('cookie-session');
const dbConfig = require('./config/db.config');
const db = require('mongoose');

const app = express()
const port = process.env.PORT || 3001;

var corsOptions = {
    origin: 'http://localhost:3000'
}

//#region  DEVELOPEMENT
if (app.get('env') === 'developement') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500)
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}
//#endregion

//#region SETUP
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieSession({
    name: 'session',
    secret: 'COOKIE_SECRET',
    httpOnly: true
}))

app.use(function (err, req, res, next) {
    res.status(err.status || 500)
    next(err);
    res.render('error', {
        message: err.message,
        error: {}
    });
})
//#endregion

//#region ROUTES
require('./routes/auth.routes')(app);
require('./routes/user.routes')(app);
//#endregion

//#region DATABASE
db.mongoose.connect(`mongodb+srv://${dbConfig.username}:${dbConfig.password}@bdogrindtracker.mqzvwfp.mongodb.net/?retryWrites=true&w=majority`, {useNewUrlParser: true, useUnifiedTopology: true}).then(() => { console.log("Successfully connected to MongoDB.") }).catch(err => { console.error("Connection error", err); process.exit(); });
//#endregion

//#region API_CALLS
app.get("/api", (req, res) =>{
    res.json({message: "Successfully acquired data from server!"});
    console.log("Server received API request!");
})
//#endregion

app.listen(port, "0.0.0.0", () => console.log(`Server listening on port ${port}!`))