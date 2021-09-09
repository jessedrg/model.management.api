const jwt = require('jsonwebtoken');
const User = require('../models/users');

const auth = async (req,res,next)=>{
    try{
    const token = req.header('Authorization').replace('Bearer','');
    const decode = jwt.verify(token,'thisismynewcourse');
    const user =await User.findOne({_id:decode._id,'tokens.token':token})
    if(!user){
        throw Error('thers no user')
    }
    req.user = user;
    req.token = token;
    console.log(user)
    next()
} catch(e){
    res.status(401).send('please authenticated yourself')
}

}


module.exports = auth;