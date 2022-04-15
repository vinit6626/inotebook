const express = require("express");
const router = express.Router();
const Note = require("../models/Note");
var fetchuser = require("../middleware/fetchuser");
const { body, validationResult } = require("express-validator");

// Route 1: get all the notes using GET: "/api/note/fetchallnotes" login required
router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {

    console.log(error.message);
    res.status(500).send("Internal surver error");

  }
});

// Route 2: Add a notes using POST: "/api/note/addnote" login required
router.post(
  "/addnote",
  fetchuser,
  [
    body("title", "Enter a valid title").isLength({ min: 3 }),
    body("description", "Description must be at least 5 characters.").isLength({min: 5 }),
  ],
  async (req, res) => {
    try {

      //if there are errors return bad request and the errors
      const { title, description, tag } = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const note = new Note({
        title,
        description,
        tag,
        user: req.user.id,
      })
      const savedNote = await note.save()

      res.json(savedNote)
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal surver error");
    }
  }
);

// Route 3: get all the notes using Put: "/api/note/updatenote/:id" login required
router.put("/updatenote/:id", fetchuser, async (req, res) => {
    try {
        
    const {title, description, tag} = req.body;
    const newNote = {};
    if(title){newNote.title = title};
    if(description){newNote.description = description};
    if(tag){newNote.tag = tag};
    //Find the note to be updated and update it.
    let note= await Note.findById(req.params.id);
    if(!note){return res.status(404).send("not found")}
    
    if(note.user.toString() !== req.user.id){return res.status(401).send("not allowed")}

    note = await Note.findByIdAndUpdate(req.params.id, {$set: newNote}, {new:true})
    res.json({note});
    
    } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal surver error");
    }
});


// Route 4: get all the notes using Delete: "/api/note/deletenote/:id" login required
router.delete("/deletenote/:id", fetchuser, async (req, res) => {
    
    try {
        
    const {title, description, tag} = req.body;

    //Find the note to be updated and update it.
    let note= await Note.findById(req.params.id);
    if(!note){return res.status(404).send("not found")}
     
    //Allow deletion only if user owns this note
    if(note.user.toString() !== req.user.id){return res.status(401).send("not allowed")}
    
    note = await Note.findByIdAndDelete(req.params.id)
    res.json({ "success": "Note has been deleted", note: note});
    } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal surver error");
    }
});
    
module.exports = router;
