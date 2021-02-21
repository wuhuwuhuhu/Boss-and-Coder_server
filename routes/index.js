var express = require('express');
var router = express.Router();

const md5 = require('blueimp-md5') //md5 implementation
const {UserModel, ChatModel} = require('../db/models');
const { route } = require('./users');
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

//update user info
router.post('/update', function(req, res){
  //get userid from cookie
  const userid = req.cookies.userid
  if(!userid){
    res.send({code: 1, msg: "haven't login"})
    return
  }
  //get user information and update
  const user = req.body
  UserModel.findByIdAndUpdate({_id: userid}, user, function (error, oldUser) {
    if(!oldUser){//this userid is not in database
      res.clearCookie('userid') //inform browser to delete cookie
      res.send({code: 1, msg: "haven't login"})
    }else{
      const {_id, username, type} = oldUser
      const data = Object.assign(user, {_id, username, type})
      res.send({code: 0, data})
    }
  })

})

//get user by user.id in cookie
router.get('/user', function(req, res) {
  const userid = req.cookies.userid
  if(!userid) {
    return res.send({code: 1, msg: "haven't login"})
  }
  UserModel.findOne({_id: userid}, filter_password, function (error, user) {
    if(!user){
      return res.send({code: 1, msg: "doesn't have this userid in database"})
    }
    res.send({code: 0, data: user})
  })
})

//get userlist by type
router.get('/userlist', function(req,res) {
  const{type} = req.query
  UserModel.find({type},filter_password, function(error, users){
    res.send({code: 0, data: users})
  })
})

//get user's chat list
router.get('/msglist', function(req, res) {
  //get userid from cookie
  const userid = req.cookies.userid
  //save all user
  const users = {}
  UserModel.find(function (error, userDocs){
    userDocs.forEach(doc => {
      users[doc._id] = {username: doc.username, avatar: doc.avatar}
    })
  })

  ChatModel.find({'$or': [{from: userid}, {to: userid}]}, filter_password, function (error, chatMsgs) {
    res.send({code: 0, data: {users, chatMsgs}})
  })
    
})


//swith msg to read true
router.post('/readmsg', function (req, res) {
  const from = req.body.from
  const to = req.cookies.userid
  ChatModel.updateMany({from, to ,read: undefined}, {read: true}, function (err, doc) {
    console.log('/readmsg', doc)
    res.send({code: 0, data: doc.nModified}) // 更新的数量
  })
  // res.send({code:0 , data: doc.nModified})
  

})

module.exports = router;