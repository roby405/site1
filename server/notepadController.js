const ash = require('express-async-handler')

const Notepad = require("./notepadModel.js")
const User = require("./userModel.js")

const readNotepad = ash(async (req, res) => {
    const notepads = await Notepad.find({ user: req.user.id })

    res.status(200).json(notepads)
})
const createNotepad = ash(async (req, res) => {
    if (!req.body.text){
        res.status(400)
        throw new Error("Not text") 
    }

    const notepad = await Notepad.create({
        text: req.body.text,
        user: req.user.id
    })

    res.status(200).json(notepad)
})
const updateNotepad = ash(async (req, res) => {
    const notepad = await Notepad.findById(req.params.id)

    if (!notepad) {
        res.status(400).json({message: "Invalid ID"})
        throw new Error("Notepad not found")
    }

    const user = await User.findById(req.user.id)

    if(!user) {
        res.status(401)
        throw new Error("No auth")
    }

    if (notepad.user.toString() !== user.id) {
        res.status(401)
        throw new Error("User not authorized")
    }
    const updatedNotepad = await Notepad.findByIdAndUpdate(req.params.id, req.body, {
        new: true
    })
    
    res.status(200).json(notepad)
})
const deleteNotepad = ash(async (req, res) => {
    const notepad = await Notepad.findById(req.params.id)

    if (!notepad) {
        res.status(400)
        throw new Error("Notepad not found")
    }

    const user = await User.findById(req.user.id)

    if(!user) {
        res.status(401)
        throw new Error("No auth")
    }

    if (notepad.user.toString() !== user.id) {
        res.status(401)
        throw new Error("User not authorized")
    }
    
    await Notepad.findByIdAndDelete(req.params.id)
    res.status(200).json({ message: "deleted successfully"})
})

module.exports = {readNotepad, createNotepad, updateNotepad, deleteNotepad}