const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const Auth = require("../db/models/auth.model.js");

verifyToken = (req, res, next) => {
    let token = req.session.token;

    if (!token) {
        return res.status(403).send({ message: "No token provided!" });
    }

    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            return res.status(401).send({ message: "Unauthorized!" });
        }
        req.userId = decoded.id;
        next();
    });
};

isAdmin = (req, res, next) => {
    Auth.findById(req.userId).then(async (user) => {
        if (user.role !== "admin") {
            await res.status(403).send({ message: "Require Admin Role!" });
            return;
        }

        next();
    }).catch(err => { res.status(500).send({ message: err })});
};

const authJwt = {
    verifyToken,
    isAdmin
};