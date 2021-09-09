const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const validate = require('validator')

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        lowercase:true,
        required:true

    },
    email:{
        type:String,
        lowercase:true,
        required:true
        
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'

    },
    clients:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'client'
    }]

})


const agencies = new mongoose.model('agencie',userSchema);

module.exports = agencies