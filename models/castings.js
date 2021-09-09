const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    client:{
            type:String,
            trim:true,
            required:true
        },
    callTime:{
        type:Number,
        trim:true,
        required:true
    },
    direction:{
        type:String,
        required:true
    },
    agencie:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'agencie'
    },
    models:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }]
    })

    const castings = mongoose.model('casting',userSchema);

    module.exports = castings;