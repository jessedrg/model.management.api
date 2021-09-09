const mongoose = require('mongoose');
const validator = require('validator');
const url = process.env.DB_URL || 'mongodb://127.0.0.1:27017/model-manager-api'
mongoose 
 .connect(url, {
    useNewUrlParser:true,useUnifiedTopology: true  })   
 .then(() => console.log("Database connected!"))
 .catch(err => console.log(err));