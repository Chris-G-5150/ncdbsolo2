const {
  fetchTopicsModel,
  fetchArticleByIdModel,
  fetchArticles,
  fetchArticleIdComments,
} = require("../models/newsModels");
const endPointsJSON = require("../../endpoints.json");

exports.getTopics = (req, res, next) => {
  fetchTopicsModel()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch(next);
};

exports.handle404 = (req, res) => {
  return res.status(404).send({ msg: "Endpoint not found" });
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleByIdModel(article_id)
    .then((article) => {
      return res.status(200).send(article);
    })
    .catch(next);
};

exports.getInfo = (req, res) => {
  return res.status(200).send({ endPointsJSON });
};

exports.getArticles = (req, res) => {
  fetchArticles().then((articleList) => {
    return res.status(200).send({ articleList });
  });
};

exports.getArticleIdComments = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleIdComments(article_id)
    .then((commentsOnArticles) => {
      return res.status(200).send({ commentsOnArticles });
    })
    .catch(next);
};
