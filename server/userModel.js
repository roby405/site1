const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },
},
{
    timestamps: true
})

module.exports = mongoose.model("User", userSchema)