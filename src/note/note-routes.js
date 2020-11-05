const express = require('express');
const path = require('path');
const xss = require("xss");
const noteService = require('./note-service')
const noteRouter = express.Router();

noteRouter
.route('/')
.get()
.post();

noteRouter
.route('/:id')
.all()
.get()
.patch()
.delete();
module.exports = noteRouter;