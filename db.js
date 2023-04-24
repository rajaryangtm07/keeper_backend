// this file is created to get connected with the database

const mongoose = require('mongoose');
require('dotenv').config();

// below line help to connect the mongoose with the database
// const mongoURI ="mongodb://localhost:27017/iNoteBook";
// const mongoURI ="mongodb://127.0.0.1:27017/iNoteBook";
const mongoURI =process.env.DATABASE;

const connectToMongo = ()=>{
    mongoose.connect(mongoURI , ()=>{
        console.log("Connected to mongo successfully");
    })
}

// exporting this file
module.exports = connectToMongo