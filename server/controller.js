const ash = require('express-async-handler')
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const User = require("./userModel.js")


const registerUser = ash(async (req, res) => {
    const {username, password} = req.body
    
    if(!username || !password){
        res.status(400)
        throw new Error("Not all fields completed")
    }
    
    const userExists = await User.findOne({username})
    
    if (userExists){
        res.status(400)
        throw new Error("User exists")
    }
    
    // hash hash
    const salt = await bcrypt.genSalt(15)
    const hashedPassword = await bcrypt.hash(password, salt)
    
    const user = await User.create({
        username,
        password: hashedPassword
    })
    
    if(user) {
        const accessToken = generateToken(user._id, true)
        // const refreshToken = generateToken(user.id, false)
        let d = new Date();
        d.setTime(d.getTime() + (5*60*1000));
        res.cookie("accessToken", accessToken, {httpOnly: false, expires: d, sameSite: "Strict"})
        // res.cookie("accessToken", refreshToken, {httpOnly: true, expires: d, sameSite: "none"})
        res.status(201).json({
            _id: user.id,
            username: user.username,
            token: token
        })
    } else {
        res.status(400)
        throw new Error("Bad Data")
    }
})
const loginUser = ash(async (req, res) => {
    const {username, password} = req.body
    if(!username || !password){
        res.status(400)
        throw new Error("Not all fields completed")
    }

    const user = await User.findOne({username})

    if (user && (await bcrypt.compare(password, user.password))){
        const accessToken = generateToken(user._id, true)
        // const refreshToken = generateToken(user.id, false)
        let d = new Date();
        d.setTime(d.getTime() + (5*60*1000));
        res.cookie("accessToken", accessToken, {httpOnly: false, expires: d, sameSite: "Strict"})
        // res.cookie("refreshToken", refreshToken, {httpOnly: true, expires: d, sameSite: "Strict"})
        res.status(200).json({
            _id: user.id,
            username: user.username,
            token: accessToken
        })  
    } else {
        res.status(400)
        throw new Error("Bad Data")
    }
})

//private function
const getUser = ash(async (req, res) => {
    const {_id, username} = await User.findById(req.user.id)

    res.status(200).json({
        id: _id,
        username
    })
}) 

const generateToken = (id, access) => {
    let token
    if (access===true){
        token = jwt.sign({id}, process.env.JWT_SECRET, {
            expiresIn: '99d'
        })
    }
    // } else {
    //     token = jwt.sign({id}, process.env.JWT_SECRET2, {
    //         expiresIn: '999d'
    //     })
    // }
    return token
}


module.exports = {registerUser, loginUser, getUser, generateToken}