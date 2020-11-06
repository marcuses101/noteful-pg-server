require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const { NODE_ENV } = require("./config");
const logger = require("./logger");
const app = express();
const folderRouter = require("./folder/folder-routes");
const noteRouter = require("./note/note-routes");

const morganOption = NODE_ENV === "production" ? "tiny" : "dev";

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());
app.use(express.json())

app.get("/", (req, res) => {
  res.send("Hello, world!");
});


app.use("/api/folder", folderRouter);
app.use("/api/note", noteRouter);

app.use((error, req, res, next) => {
  let response;
  if (NODE_ENV === "production") {
    response = { error: { message: "server error" } };
  } else {
    logger.log(error);
    response = { message: error.message, error };
  }
  res.status(500).json(response);
});

module.exports = app;
