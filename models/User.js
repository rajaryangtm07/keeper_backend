const mongoose = require('mongoose');
const { Schema } = mongoose;

// we will create the schema now for the mongoDB
// in mongo db the model is basically the table part 

const UserSchema = new Schema({
   name:{
    type:String,
    required:true
   },
   email:{
    type:String,
    required:true,
    unique:true

   },
   password:{
    type:String,
    required:true
   },
   date:{
    type:Date,
    default:Date.now
   }
});


// exporting the mongodb server
const User = mongoose.model('user' , UserSchema);
User.createIndexes();
// due to above line duplicate value ni jaaegi
module.exports = mongoose.model('user' , UserSchema);