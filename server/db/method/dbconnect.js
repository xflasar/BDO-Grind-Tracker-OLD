const db = require('mongoose');
const dbConfig = require('../../config/db.config.js');

exports.dbConnect = async () => {
    try
    {
        /* db.mongoose.connect(`mongodb+srv://${dbConfig.username}:${dbConfig.password}@bdogrindtracker.mqzvwfp.mongodb.net/?retryWrites=true&w=majority`, {useNewUrlParser: true, useUnifiedTopology: true}).then((dbs) => { console.log("Successfully connected to MongoDB."); console.log(dbs); return dbs; }).catch(err => { console.error("Connection error", err); process.exit(); }); */

        const connection = await db.connect(`mongodb+srv://${dbConfig.username}:${dbConfig.password}@bdogrindtracker.mqzvwfp.mongodb.net/?retryWrites=true&w=majority`, {useNewUrlParser: true, useUnifiedTopology: true});
        console.log("Successfully connected to MongoDB.");
        return connection;
    }
    catch (err)
    {
        console.log(err);
    }
//#endregion
}
//#region DATABASE

exports.db = db;