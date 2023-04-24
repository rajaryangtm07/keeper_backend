const mongoose = require('mongoose');
const { Schema } = mongoose;
// we will create the schema now for the mongoDB
// in mongo db the model is basically the table part 

const NotesSchema = new Schema({
  

   // linking the notes with the user as in foreign key
   user:{
      type:mongoose.Schema.Types.ObjectId,
      ref:'user'

   },
   title:{
    type:String,
    required:true
   },
   description:{
    type:String,
    required:true,
    

   },
//   tags:{
//     type:String,
//    default:"General"
   // },
   date:{
    type:Date,
    default:Date.now
   }
});


// exporting the mongodb server
module.exports = mongoose.model('notes' , NotesSchema);