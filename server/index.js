const express = require('express')
const app = express()
const port = process.env.PORT || 3001;

app.get("/api", (req, res) =>{
    res.json({message: "Successfully acquired data from server!"});
    console.log("Server received API request!");
})


app.listen(port, () => console.log(`Server listening on port ${port}!`))