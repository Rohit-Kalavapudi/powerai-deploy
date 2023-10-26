const express = require('express')
const router = express.Router()
const User = require('../models/User')
const {body, validationResult} = require('express-validator')
const bcrypt = require('bcryptjs')
var jwt = require('jsonwebtoken')
const JWT_SECRET = 'This is a string';
var fetchuser = require('../middleware/fetchuser')


//create user
router.post('/createuser',[
    body('name').isLength({min:3}),
    body('email',"you have not entered a valid email").isEmail(),
    body('password').isLength({min:5})
],async(req,res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty())
    {
        return res.status(400).json({errors: errors.array()})
    }
    const salt = await bcrypt.genSalt(10);
    const secPass =await bcrypt.hash(req.body.password, salt)
    try{
        const user = await User.create({
            name: req.body.name,
            password: secPass,
            email: req.body.email

        })
        const data = {
            user:{
                id:user.id

            }

        }
        console.log(data)
        const authtoken=jwt.sign(data,JWT_SECRET)
        console.log(authtoken)
        // console.log(authtoken)
        res.json({success:true,token:authtoken,name:user.name})
        
        const jwtData = jwt.sign(data,JWT_SECRET);
        // console.log("sdf")
        user=>res.json(user)
        
        .catch(err=>{console.log(err)
        res.json("enter a unique value")})
    }
    catch(error){
        console.log(error.message)
        res.json("Some error occured")
    }

})

//login
router.post('/login', [
    body('email','Enter a valid email').isEmail(),
    body('password','Password cannot be blank').exists(),

],async(req,res)=>{
    const errors= validationResult(req);    
    if(!errors.isEmpty())
    {
        return res.status(400).json({errors: errors.array()});
    }

    const {email,password} = req.body;
    try{
        let user = await User.findOne({email});
        if(!user)
        {
            return res.status(400).json({success:false,error:"Login with correct credentials"});
             
        }
        const passwordCompare =await bcrypt.compare(password,user.password);
        if(!passwordCompare)
        {
            return res.status(400).json({success:false,error: "Login with correct credentials"})
        }

        const data = {
            user: {
                id: user.id
            }
        }
        console.log(user)
        const authtoken = jwt.sign(data,JWT_SECRET)
        res.send({success:true,token:authtoken,name:user.name})
    }
    catch(error){
        console.log(error.message)
        res.json("Some error occured")}
})

//getuserdetails
router.post('/getuser', fetchuser,async(req,res)=>{

    try{
        console.log(req)
        userId=req.user.id;
        const user = await User.findById(userId).select("-password")
        res.send(user)

    }
    catch(error){
        console.log(error.message)
        res.json("Some error occured")
    }
})

module.exports = router