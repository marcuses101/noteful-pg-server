const express = require("express");
const path = require("path");
const xss = require("xss");
const noteService = require("./note-service");
const noteRouter = express.Router();

function serializeNote(note) {
  return { ...note, name: xss(note.name), content: xss(note.content) };
}

noteRouter
  .route("/")
  .get(async (req, res, next) => {
    try {
    const notes = noteService.getAllNotes(req.app.get('db'));
    res.json(notes.map(serializeNote))
    } catch (error) {
      next(error);
    }
  })
  .post(async (req, res, next) => {
    try {
      const {name, modified, folder_id, content} = req.body;
      const newNote = {name, folder_id, content}
      for (const [key, value] of Object.entries(newNote)) {
        if (!value) return res.status(400).send({
          error: {message: `Error: ${key} is required`}
        })
      }
      newNote.modified = modified;
      const note = await noteService.insertNote(req.app.get('db'), newNote);
      res.status(201).json(serializeNote(note));
    } catch (error) {
      next(error);
    }
  });

noteRouter
  .route("/:id")
  .all(async (req, res, next) => {
    try {
      const {id} = req.params
      const note = await noteService.getNoteById(req.app.get("db"),id)
      if (!note) res.status(404).json({
        error: {message: `note with id ${id} not found`}
      })
      req.note = serializeNote(note);
      next();
    } catch (error) {
      next(error);
    }
  })
  .get((req,res)=>{
    res.json(req.note)
  })
  .patch(async (req, res, next) => {
    try {
      const {name, folder_id, content} = req.body;
      const updatedNote = {name, folder_id, content};
      if (!Object.values(updatedNote).some(Boolean)) return res.status(400).send(`'name' 'folder_id' or 'content' required`)
      updatedNote.modified = new Date();
     await noteService.updateNote(req.app.get('db'),req.note.id, updatedNote);
     res.status(204).send('Note updated');
    } catch (error) {
      next(error);
    }
  })
  .delete(async (req, res, next) => {
    try {
      await noteService.deleteNote(req.app.get('db'),req.note.id)
    } catch (error) {
      next(error);
    }
  });
module.exports = noteRouter;
