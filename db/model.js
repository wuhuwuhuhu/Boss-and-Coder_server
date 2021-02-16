/*
includes multiple Collection Models 
*/
/* 1. connect to database */

// 1.1 import
const mongoose = require('mongoose')
// 1.2 connect to database
mongoose.connect('mongodb://localhost:27017/Boss-and-Coder')
// 1.3 get connected object
const conn = mongoose.connection
// 1.4 bind connected listening
conn.on('connected', function(){
    //connect success
    console.log('success: database connected!')
})

/* 2. get corrseponding Model of collection*/

// 2.1 define schema()
const userSchema = mongoose.Schema({
    // define structure: attribute name/type,required?,default
    username: {type: String, required: true},
    password: {type: String, required: true},
    type:{type:String, required: true},
    avatar: {type:String},
    info: {type:String},
    company: {type:String},
    salary:  {type:String}

})
// 2.2 define Model to opertae corresponding collection
const UserModel = mongoose.model('user', userSchema) //collection: users
// 2.3 export Model

exports.UserModel = UserModel