const express = require("express");
const cors = require("cors");

const {
    getTopics,
    handle404,
    getArticleById,
    getInfo,
    getArticles,
    getArticleIdComments,
    postArticleIdComments,
    updateArticleVotes,
    deleteCommentById,
    getUsers,
} = require("./controller/controller.js");

const {
    customErrorHandler,
    handleServerErrors,
    handlePsqlErrors,
} = require("./errorHandlers/errorHandlers.js");

const app = express();
app.use(cors());
app.use(express.json());


app.get("/api/topics", getApiArticles)
app.get("/api/topics", getTopics);
app.get("/api", getInfo);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles", getArticles);
app.get("/api/:article_id/comments", getArticleIdComments);
app.get("/api/users", getUsers);

app.post("/api/articles/:article_id/comments", postArticleIdComments);

app.patch("/api/articles/:article_id", updateArticleVotes);

app.delete("/api/comments/:comment_id", deleteCommentById);

app.use(customErrorHandler);    
app.use(handlePsqlErrors);
app.use(handleServerErrors);

app.all("*", handle404);

module.exports = app;
