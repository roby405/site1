const express = require("express")
const router = express.Router()
const { registerUser, loginUser, getUser } = require("./controller.js")

const authPr = require("./authMiddleware.js")

// router.post("/signup", registerUser)s
router.post("/signin", loginUser)
router.get("/current", authPr, getUser)


module.exports = router