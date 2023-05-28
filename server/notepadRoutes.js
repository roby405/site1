const express = require("express")
const router = express.Router()
const { readNotepad, createNotepad, updateNotepad, deleteNotepad} = require("./notepadController.js")

const authPr = require("./authMiddleware.js")

router.route("/").get(authPr, readNotepad).post(authPr, createNotepad)
router.route("/:id").put(authPr, updateNotepad).delete(authPr, deleteNotepad)


module.exports = router