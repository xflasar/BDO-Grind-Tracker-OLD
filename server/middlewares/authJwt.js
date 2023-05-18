const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const Auth = require("../db/models/auth.model.js");
const { dbConnect } = require("../db/method/dbconnect.js");

verifyToken = async (req, res, next) => {
    let token = req.session.token;
  
    if (!token) {
      return res.status(403).send({ message: "No token provided!" });
    }
  
    jwt.verify(token, config.secret, async (err, decoded) => {
      if (err) {
        return res.status(401).send({ message: "Unauthorized!" });
      }
      req.authId = decoded.id;
      try {
        let db = await dbConnect();
        try {
          let userAuth = await Auth.findById(req.authId).then((user) => {
            db.connection.close().then(() => { console.log("Connection closed!")}); return user; 
            });
          if (!userAuth) {
            await res.status(404).send({ message: "User Not found. Auth" });
            return;
          }
          req.userId = userAuth.UserId.toString();
          next();
        } catch (err) {
          res.status(500).send({ message: err });
          console.log(err);
        }
      } catch (err) {
        console.log(err);
      }
    });
  };
  
  isAdmin = async (req, res, next) => {
    let db = await dbConnect();
    try {
      let user = await Auth.findById(req.authId);
      if (user.role !== "admin") {
        await res.status(403).send({ message: "Require Admin Role!" });
        return;
      }
      next();
    } catch (err) {
      res.status(500).send({ message: err });
      console.log(err);
    } finally {
      await db.disconnect().then(() => {
        console.log("Connection closed!");
      });
    }
  };

const authJwt = {
    verifyToken,
    isAdmin
};