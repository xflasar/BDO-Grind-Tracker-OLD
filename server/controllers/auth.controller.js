const config = require("../config/auth.config.js");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const Auth = require("../db/models/auth.model.js");
const User = require("../db/models/user.model.js");

exports.signup = async (req, res) => {
    const auth = new Auth({
      username: await req.body.username,
      email: await req.body.email,
      password: await bcrypt.hash(req.body.password, 8)
    });

    auth.save().then(() => {
      const user = new User({
          DisplayName: req.body.displayName,
          TotalTime: 0,
          TotalEarnings: 0,
          Sites: [],
          TotalExpenses: 0,
          authenticationId: auth._id,
          Sessions: [],
          Settings: null
      });

  user.save().then();
  auth.UserId = user._id;
  auth.save().then(async (userAuth) => {
    var token = await jwt.sign({ id: userAuth.id }, config.secret, {
      expiresIn: 86400, // 24 hours
    });
    req.session.token = token;
    res.status(200).send({ accessToken: token, message: "User was registered successfully!" });
  }).catch(err => { res.status(500).send({ message: err })});
  }).catch(err => { res.status(500).send({ message: err });
    return});
  
    
  };
  
  exports.signin = (req, res) => {
    Auth.findOne({
      username: req.body.username,
    }).then(async (user) => {
        if (!user) {
          return await res.status(404).send({ message: "User not found." });
        }
  
        var passwordIsValid = await bcrypt.compareSync(
          req.body.password,
          user.password
        );
  
        if (!passwordIsValid) {
          return res.status(401).send({ message: "Invalid Password!" });
        }
  
        var token = await jwt.sign({ id: user.id }, config.secret, {
          expiresIn: 86400, // 24 hours
        });
  
        req.session.token = token;
  
        await res.status(200).send({
          id: user._id,
          username: user.username,
          email: user.email,
          UserId: user.UserId,
          accessToken: token
        });
      }).catch(err => { res.status(500).send({ message: err })});
  };

exports.signout = (req, res) => {
    try {
        req.session = null;
        return res.status(200).send({ message: `Successfully signed out!`});
    }
    catch (err) {
        console.log(err);
    }
};