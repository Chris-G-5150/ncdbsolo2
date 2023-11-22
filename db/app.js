const express = require("express");

const {
  getTopicsController,
  handle404Controller,
  getArticleByIdController,
} = require("./controller/controller.js");

const {
  customErrorHandler,
  handleServerErrors,
  handlePsqlErrors
} = require("../db/errorHandlers/errorHandlers.js");

const app = express();

app.get("/api/topics", getTopicsController);
app.get("/api/articles/:article_id", getArticleByIdController);

app.use(customErrorHandler);
app.use(handlePsqlErrors);
app.use(handleServerErrors);


app.all("*", handle404Controller);

module.exports = app;
