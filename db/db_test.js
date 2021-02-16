/*
test to operate mongodb by using mongoose 
*/
const md5 = require('blueimp-md5') //md5 implementation
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
    type:{type:String, required: true}
})
// 2.2 define Model to opertae corresponding collection
const UserModel = mongoose.model('user', userSchema) //collection: users

/* 3. use Model or its instances to CRUD */
// 3.1 use save() of Model's instance(object) to Create data 
function testSave(){
    //create UserModel instance
    const userModel = new UserModel({username: 'Tom', password: md5('123'), type: 'coder'})
    //use save() create data
    userModel.save(function(error, user){
        console.log('save()', error, user)
    })
}
// 3.2 use find()/findOne() of Model(function) to find data
 function testFind() {
     //find all matched, return array(if no matched return empty array)
     UserModel.find(function(error, users) {
         console.log('find()', error, users)
     })
     //find one, return object (if no matched return null)
     UserModel.findOne({_id:'602a0ea7bc514b8f3123b314'}, function(error, user) {
         console.log('findOne()', error, user)
     })
 }
 
 // 3.3 use findByIdAndUpdate() of Model(function) to update
 function testUpdate() {
     UserModel.findByIdAndUpdate({_id: '602a0ea7bc514b8f3123b314'}, 
     {username: 'Jack'},
     function(error, doc) {
         console.log('findByIdAndUpdate()', error, doc)
     })
 }

 // 3.4 use remove() of Model(function) to delete
 function testDelete() {
     UserModel.remove({_id: '602a0ea7bc514b8f3123b314'}, function (error, doc){
         console.log('remove()',error, doc) // { n: 0, ok: 1, deletedCount: 0 }
     })
 }
 testDelete()