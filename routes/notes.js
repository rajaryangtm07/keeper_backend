const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const Notes = require('../models/Notes');
const { body, validationResult } = require('express-validator');

//Route1: Get all the notes using :GET "/api/auth/getuser" . Login required
router.get('/fetchallnotes', fetchuser, async (req, res) => {

    try {
        const notes = await Notes.find({ user: req.user.id });
        res.json(notes)
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Some error occured");
    }
})


//Route2: Get all the notes using :GET "/api/auth/getuser" . Login required
router.post('/addnotes', fetchuser, [
    body('title', 'Enter a valid title').isLength({ min: 3 }),
    body('description', 'Description must be of at least 5 charecters').isLength({ min: 5 }),
], async (req, res) => {

    try {
        const { title, description, tag } = req.body;
        // if there are errors return bad request and the error
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() }); // here error will be in the form of the array
        }
        const note = new Notes({
            title, description, tag, user: req.user.id
        })
        const savedNote = await note.save()
        res.json([savedNote])
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some error occured");
    }
})

//Route 3: Update an existing note using :put "/api/auth/updatenote" . Login required
router.post('/updatenote/:id', fetchuser, async (req, res) => {
    const { title, description } = req.body;
    console.log(title, description);
    console.log(req.body);
    // create a newnote object
    try {
        const newNote = {};
        if (title) { newNote.title = title };
        if (description) { newNote.description = description };
       // if (tag) { newNote.tag = tag };

        // find the node to be updated and update it
        let note = await Notes.findById(req.params.id);
        if (!note) { res.status(404).send("Not Found") }

        if (note.user.toString() != req.user.id) {
            return res.status(401).send("Not Allowed");
        }

        // uisng the update operation of mongo db crud
        note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
        res.json({ note });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some error occured");
    }

    // const newNote = {};
    // if (title) { newNote.title = title };
    // if (description) { newNote.desciption = title };
    // if (tag) { newNote.tag = tag };

    // // find the node to be updated and update it
    // let note = await Notes.findById(req.params.id);
    // if (!note) { res.status(404).send("Not Found") }

    // if (note.user.toString() != req.user.id) {
    //     return res.status(401).send("Not Allowed");
    // }

    // // uisng the update operation of mongo db crud
    // note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
    // res.json({ note });
})

//Route 4: Delete an existing note using :DELETE "/api/auth/deletenote" . Login required
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
   // const { title, description, tag } = req.body;
    try {
        // find the node to be deleted and delete it
        // check weather jo aadmi delete kr raha note woh usi ka note hai na
        let note = await Notes.findById(req.params.id);
        if (!note) { res.status(404).send("Not Found") }


        // check weather jo aadmi delete kr raha note woh usi ka note hai na
        // allow deletion only if  the user owns this note
        if (note.user.toString() != req.user.id) {
            return res.status(401).send("Not Allowed");
        }

        // uisng the update operation of mongo db crud
        note = await Notes.findByIdAndDelete(req.params.id)
        res.json({ "Success": "Note has been deleted", note: note });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some error occured");
    }




})
module.exports = router;