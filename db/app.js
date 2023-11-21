const express = require("express");

const {
  getTopicsController,
  handle404Controller,
  getInfoController,
} = require("./controller/controller.js");

const app = express();

app.get("/api/topics", getTopicsController);
app.get("/api/", getInfoController)
app.get("/api/info/:infoId", getInfoController)

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send("server error!");
});

app.all("*", handle404Controller);

module.exports = app;
