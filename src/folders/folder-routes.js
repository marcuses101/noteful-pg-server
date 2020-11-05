const express = require('express');
const path = require('path');
const xss = require("xss");
const folderService = require('./folder-service')


const folderRouter = express.Router();

folderRouter
.route('/')
.get()
.post()

folderRouter
.route('/:id')
.all()
.get()
.update()
.delete();

module.exports = folderRouter;