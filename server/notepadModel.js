const mongoose = require("mongoose")

const notepadSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    text: {
        type: String
    }
},
{
    timestamps: true
})

module.exports = mongoose.model("Notepad", notepadSchema)