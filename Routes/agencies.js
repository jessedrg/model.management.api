const express = require('express')
const router = express.Router()
const User = require('../models/users')
const Agencies = require('../models/agencies')
const modelAuth = require('../middleware/agencieAuth')
const casting = require('../models/castings')
const auth = require('../middleware/authorization')



//Create Agency
router.post('/create/agency',modelAuth,async (req,res)=>{
    const email = req.body.email
    console.log(email)
    const createAgency = await Agencies.findOne({email:req.body.email})
    if(createAgency){
        throw Error('Agencie already created')
    }
    const newAgency = new Agencies({...req.body,owner:req.user._id})
    newAgency.owner = req.user._id
    try{
       await newAgency.save()
       res.status(201).send({agency:newAgency})

    }catch(e){
        res.status(404).send('internal server error')
        console.log(e)

    }

})
//Add Agency Image
router.patch('/agency/image',modelAuth,async(req,res)=>{


})
router.get('/angecy/clients',modelAuth,async(req,res)=>{
    try{
        const getAgency = await Agencies.findOne({owner:req.user._id}).populate("clients")
        res.send({clients: getAgency.clients})

    } catch(e){
        res.status(404).send('internal server error')
        console.log(e)

    }
    

})


router.get('/agency',modelAuth,async(req,res)=>{
    try{
        console.log(req.user.email)
        const getAgency = await Agencies.findOne({owner:req.user._id}).populate("owner");
        res.send({getAgency})

    }catch(e){
        res.status(404).send('internal server error')
        console.log(e)


    }
})
router.get('all/agencies',auth, async(req,res)=>{
    try{
        const getAgencies =  await Agencies.find().populate("owner")
        res.send({alllAgencies: getAgencies})

    }catch(e){
        res.status(404).send('internal server error')
        console.log(e)

    }
})

router.delete('agencie/delete',modelAuth,async(req,res)=>{
    const deleteAgency = await Agencies.findOneAndRemove({owner:req.user._id})
    try{
        await deleteAgency.save()
        res.send({deleteAgency})


    }catch(e){
        res.status(404).send('internal server error')
        console.log(e)
    }


})
//Create New Casting
router.post('/agencie/casting',modelAuth,async(req,res)=>{
    const owner = await Agencies.findOne({owner:req.user._id})
    const {client,callTime,direction} = req.body
    const newCasting = new casting({client,callTime,direction,agencie:owner._id})
    try{
        await newCasting.save()
        res.status(201).send({newCasting})

    } catch(e){
        res.status(404).send('internal server error')
        console.log(e)


    }

    
    
})
//Add model to casting
router.patch('/casting/models',modelAuth,async(req,res)=>{
    const model = await User.findOne({name:req.body.name,second_name:req.body.second_name})
    const agencie = await Agencies.findOne({owner:req.user._id})
    console.log(agencie)
    if(model.type!=='model'){
        throw Error('Only model are able to go to castings')
    }
    const findModel = await casting.findOne({models:model._id})
    if(findModel){
        throw Error('Model already at the casting')
    }
    const addModel = await casting.findOneAndUpdate({owner:agencie._id},{models:model._id})
    console.log(addModel)
    try{
        await addModel.save()
        res.send({newModel: addModel});

    }catch(e){
        res.status(404).send('internal server error')
        console.log(e)

    }
})
//Add agency to model
router.patch('/model/agency',modelAuth,async(req,res)=>{
    const model = await User.findOne({name:req.body.name,second_name:req.body.second_name})
    const agencie = await Agencies.findOne({owner:req.user._id})
    const findModelAgency = await User.findOne({agencies:agencie._id})
    if(findModelAgency){
        throw Error('User already signed to the agency')
    }
    
    if(model.type==='model'){
        const addAgency = await User.findOneAndUpdate({name:req.body.name,second_name:req.body.second_name},{agencies:agencie._id})

    }
    if(model.type==='agency'){
        throw Error("Agencys can't sign to agencys")

    }
    const addAgency = await User.findOneAndUpdate({name:req.body.name,second_name:req.body.second_name},{agencies:agencie._id,type:'model'})
    try{
        await addAgency.save()
        res.send({agencyadded:addAgency})

    } catch(e){
        res.status(404).send('internal server error')
        console.log(e)

    }
   


})

module.exports = router