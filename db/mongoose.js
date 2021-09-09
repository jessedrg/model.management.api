const mongoose = require('mongoose');
const validator = require('validator');

mongoose 
 .connect(process.env.URL, {
    useNewUrlParser:true,useUnifiedTopology: true  })   
 .then(() => console.log("Database connected!"))
 .catch(err => console.log(err));