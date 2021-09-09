const jwt = require("jsonwebtoken");
const User = require("../models/users");


const modelAuth = async (req,res,next)=>{
    try{
        const token = req.header('Authorization').replace('Bearer','');
        
        const decode = jwt.verify(token,'thisismynewcourse');
        const user =  await User.findOne({_id:decode._id,'tokens.token':token})
        
        if(user.type!== 'agency'){
            throw Error('U dont have the role of agency')
        }
        req.user = user
        next()

    }catch (e){
        res.status(401).send('Please authenticate youself')
        console.log(e)

    }
}

module.exports = modelAuth