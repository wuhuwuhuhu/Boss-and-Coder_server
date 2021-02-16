var express = require('express');
var router = express.Router();

const md5 = require('blueimp-md5') //md5 implementation
const {UserModel} = require('../db/model')
const filter_password = {password: 0, __v: 0} //filter password

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//declare a register route
/*
a) path: /register
b) request method: POST
c) parameters:(String username, String password)
d) register success: {code: 0, data:{_id: 'hashid', username: 'abc', password: '123'}}
e) register fail: {code: 1, msg; 'this user name has been registered.'}
f) admin has been registered
*/
router.post('/register', (req, res) => {
  //1. get request parameters
  const {username, password, type} = req.body
  //2. process
      UserModel.findOne({'username': username}, function (error, user) {
        if(user) {
          //user exist, fail 
          res.send({code: 1, msg: 'this user name has been registered.'})
        }else {
        //new user, success
        new UserModel({username, type, password: md5(password)}).save(function (error, user) {
          //return new user
          const data = {username, type, _id: user._id}
          //generate cookie for user and make the browser save it
          res.cookie('userid', user._id, {maxAge: 1000*60*60*24*7}) //1000 ms * 60s * 60m * 24 hour * 7 day
          res.send({code: 0, data})
        })
        }
      })

  
})

//declare a login route
router.post('/login', function (req, res) {
  const {username, password} = req.body
  // use {username, password} to get user in users collection, if null return error message, else return user
  UserModel.findOne({username, password: md5(password)}, filter_password,  function (error, user) {
    if(user) {
      //generate cookie for user and make the browser save it
      res.cookie('userid', user._id, {maxAge: 1000*60*60*24*7}) //1000 ms * 60s * 60m * 24 hour * 7 day
      res.send({code: 0, user})
    }
    else{
      res.send({code: 1, msg: 'password can not match user name'})

    }
  })
})


module.exports = router;
