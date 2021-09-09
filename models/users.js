const mongoose = require('mongoose')

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    type:{
        type:String,
        lowercase:true,
        required:true,
        
        
    },
    name:{
        type:String,
        lowercase:true,
        required:true
    },
    second_name:{
        type:String,
        lowercase:true,
        required:true
    },
    email:{
        type:String,
        lowercase:true,
        required:true
    },
    age:{
        type:Number,
        lowercase:true,
        required:true
    },
    
    stature:Number,
    country: String,
    password:{
        type:String,
        validate(data){
            if(data<6 || data.includes('password')){
                throw Error('not secure password')
            }
        },
        required:true
    },
   agencies:[{
       type: mongoose.Schema.Types.ObjectId,
       ref:'agencie'
   }],
    tokens:[{
        token:{
            type:String,
            required:true
        }}]
})
userSchema.methods.generateToken = async function(){
    const user = this;
    const token = jwt.sign({_id:user._id.toString()},'thisismynewcourse',)
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token

}
userSchema.methods.toJSON =  function() {
    const user = this;
    const userObject = user.toObject()
    delete userObject.password;
    delete userObject.tokens
    delete userObject.avatar
    return userObject
}
userSchema.statics.findByCredentials = async (email,password)=>{
    const user = await User.findOne({email})
    console.log(user)
    if(!user){
        throw new Error('unable to log in')
    }
    const isMatch = await bcrypt.compare(password,user.password)
    console.log(isMatch)
  
    if(!isMatch){
        throw new Error('unable to log in')
    }
    return user
    
   

}


userSchema.pre('save',async function(next){
    const user = this;
    if(user.isModified('password')){
        user.password =await bcrypt.hash(user.password,8)
    }
    next()

})

const User = mongoose.model('User',userSchema)

module.exports = User