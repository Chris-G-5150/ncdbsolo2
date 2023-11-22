const express = require("express");

const {
  getTopics,
  handle404,
  getArticleById,
  getInfo,
  getArticles,
} = require("./controller/controller.js");

const {
  customErrorHandler,
  handleServerErrors,
  handlePsqlErrors,
} = require("../db/errorHandlers/errorHandlers.js");

const app = express();

app.get("/api/topics", getTopics);
app.get("/api", getInfo);
app.get("/api/articles/:article_id", getArticleById)
app.get("/api/articles", getArticles);

app.use(customErrorHandler);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

app.all("*", handle404);

module.exports = app;
