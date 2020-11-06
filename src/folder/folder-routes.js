const express = require("express");
const path = require("path");
const xss = require("xss");
const folderService = require("./folder-service");

const folderRouter = express.Router();

const serializeFolder = folder => ({...folder, name: xss(folder.name)})

folderRouter
  .route("/")
  .get(async (req, res, next) => {
    try {
      const folders = await folderService.getAllFolders(req.app.get("db"));
      res.json(folders.map(serializeFolder));
    } catch (error) {
      next(error);
    }
  })
  .post(async (req, res, next) => {
    try {
      const newFolder = serializeFolder({ name: req.body.name });
      const responseFolder = await folderService.insertFolder(
        req.app.get("db"),
        newFolder
      );
      res
        .status(201)
        .location(path.posix.join(req.originalUrl, `/${responseFolder.id}`))
        .json(responseFolder);
    } catch (error) {
      next(error);
    }
  });

folderRouter
  .route("/:id")
  .all(async (req, res, next) => {
    try {
      const {id} = req.params;
      const folder = await folderService.getFolderById(req.app.get('db'), id);
      if (!folder) return res.status(404).json({
        error: {message: `Article doesn't exist`}
      })
      req.folder = serializeFolder(folder);
      next();
    } catch (error) {
      next(error);
    }
  })
  .get((req,res)=>{
    res.json(req.folder)
  })
  .patch(async (req, res, next) => {
    try {
      const {name} = req.body;
      const updatedFolder = {name};
      if (!Object.values(updatedFolder).some(Boolean)) return res.status(400).end();
      await folderService.updateFolder(req.app.get('db'), req.folder.id, updatedFolder)
      res.status(204).send('bookmark updated');
    } catch (error) {
      next(error);
    }
  })
  .delete(async (req, res, next) => {
    try {
      await folderService.deleteFolder(req.app.get('db'),req.folder.id)
    } catch (error) {
      next(error);
    }
  });

module.exports = folderRouter;
