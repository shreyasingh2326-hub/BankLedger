const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken")
const emailService = require("../services/email.service")

async function registerUser(req,res){
    const {email,name,password} = req.body

    const userExists = await userModel.findOne({
        email:email //rhs email is from req.body
    })

    if(userExists){
        return res.status(422).json({
            message:"User already exists!",
            status: "failed"
        })
    }

    const user = await userModel.create({
        email,
        name,
        password
    })

    const token = jwt.sign({
        userId : user._id
    }, process.env.JWT_SECRET)  //token cookie mei jata h token k andar user ki id rkhi ja rhi h
    //JWT mein userId rakhna usually better hota hai because database mein user ko identify karne ka primary identifier _id hota hai.

    res.cookie("token",token)

    res.status(201).json({
        message: "user registered successfully",
        user:{
            id: user._id,
            name: user.name,
            email:user.email,
        },
        token
    })

    await emailService.sendRegistrationEmail(user.email,user.name)
}

async function loginUser(req,res){
    const { email,password } = req.body
    const user = await userModel.findOne({email}).select("+password")

    if(!user){
        return res.status(401).json({
            message: "Email or password is invalid"
        })
    }

    const isValidUser = await user.comparePassword(password)

    if(!isValidUser){
        return res.status(401).json({
            message: "Password is invalid"
        })
    }

    const token = jwt.sign({
        userId: user._id,
    },process.env.JWT_SECRET)

    res.cookie("token",token)
    res.status(200).json({
        message: "user registered successfully",
        user:{
            id: user._id,
            name: user.name,
            email:user.email,
        },
        token
    })
}
module.exports = {registerUser,loginUser}

