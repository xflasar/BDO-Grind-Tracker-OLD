const express = require('express')
const path = require('path')
const app = express()
const port = process.env.PORT || 3001;

//app.use(express.static(path.resolve(__dirname, '../client/public')));
app.get("/api", (req, res) =>{
    res.json({message: "Successfully acquired data from server!"});
    console.log("Server received API request!");
})
/*
app.get('*', (req, res) => {
    res.sendStatus(404);
});
*/
if (app.get('env') === 'developement') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500)
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}
app.use(function (err, req, res, next) {
    res.status(err.status || 500)
    next(err);
    res.render('error', {
        message: err.message,
        error: {}
    });
})

app.listen(port, "0.0.0.0", () => console.log(`Server listening on port ${port}!`))