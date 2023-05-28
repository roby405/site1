const jwt = require('jsonwebtoken')
const ash = require('express-async-handler')
const User = require('./userModel.js')
const userController = require("./controller.js")

const authProtection = ash(async (req, res, next) => {
    let token
    const cookies = req.cookies
    // http shit (format is Bearer token)
    if(cookies.accessToken!==undefined && cookies.accessToken!=false){
        try {
            // token from header
            token = cookies.accessToken

            jwt.verify(token, process.env.JWT_SECRET, async function(err, decoded) {
                if (err) {
                    if (err.name === "TokenExpiredError") {
                        const refreshToken = cookies.refreshToken
                    }
                req.user = await User.findById(decoded.id).select('-password')
                if (req.user!==undefined && req.user!=false){
                    res.status(402)
                    throw new Error("Not correct token")
                }
                next()
                }
              });

        } catch (error) {
            console.log(error)
            res.status(401)
            throw new Error("No auth")
        }
    }

    if(!token) {
        res.status(401)
        throw new Error(`No token`)
    }
})

module.exports = authProtection