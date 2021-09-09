const express = require('express')
const router = express.Router()
const User = require('../models/users')
const Casting = require('../models/castings')
const auth = require('../middleware/authorization')




//Creating a new user
router.post('/user',async(req,res)=>{
    const email = req.body.email
    const findExistingUser =await User.findOne({email})
    if(findExistingUser){
        res.send('User already exist')
    }
    const user = new User(req.body)
    try{
        await user.save()
        const token =await user.generateToken()
        res.status(201).send({user,token})


    } catch(e){
        res.status(404).send('internal server error')
        console.log(e)
    }


})
router.get('/users/:type',async(req,res)=>{
    const {type} = req.params
    try{
       
            const typeUsers = await User.find({type})
            res.send({users:typeUsers})
        
        
    } catch(e) {
        res.status(404).send('internal server error')
        console.log(e)
    }
    
    

})
router.get('/users',async(req,res)=>{
    const {type} = req.params
    try{
        
        const typeUsers = await User.find()
        res.send({users:typeUsers})

    } catch(e) {
        res.status(404).send('internal server error')
        console.log(e)
    }
    
    

})

//get castings 
router.get('/casting/model/:name/:second_name',auth,async (req,res)=>{
    const {name,second_name} = req.params;
    try{
        const findModel = await User.findOne({name,second_name})
        if(findModel === undefined){
            throw Error('User not found')
        }
        const findCasting =await Casting.findOne({models:findModel._id}).populate('models')
        res.send({casting:findCasting})

    }catch(e){
        res.status(404).send('internal server error')
        console.log(e)

    }

})
router.get('all/model/agencies',auth, async (req,res)=>{
    try{
        const getModelAgencies =await User.find({type:'model'}).populate('agencies')
        res.send({model:getModelAgencies})

    }catch(e){
        res.status(404).send('internal server error')
        console.log(e)

    }
})

//Loging user
router.post('/login',async(req,res)=>{
    try{
        console.log(req.body)
        const user = await User.findByCredentials(req.body.email,req.body.password)
        
        const token = await user.generateToken()
        res.send({user,token})
        
    } catch(e){
        res.status(400).send()
        console.log(e)
       
    }
    
    
})
//Logout
router.post('/logout',auth,async (req,res)=>{
    try{
        const newToken = req.user.tokens.filter((token)=>{
            return token.token !== req.token
        })
        
        const findUser =await User.findOneAndUpdate({_id:req.user._id},{tokens:newToken})
        await findUser.save()
        
        res.send({tokens:findUser.tokens,deletedToken:req.token})

    }catch(e){
        res.status(400).send()
        console.log(e)
    }

})
router.delete('/delete/user',auth,async(req,res)=>{
    try{
        const deleteUser = await User.findByIdAndDelete(req.user._id)
        res.send(req.user);

    } catch(e){
        res.status(400).send();
    }
   
})



//Logout user 





module.exports = router