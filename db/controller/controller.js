const { getTopicsModel, getArticleByIdModel } = require("../models/newsModels");

exports.getTopicsController = (req, res, next) => {
  getTopicsModel()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch(next);
};

exports.handle404Controller = (req, res) => {
  return res.status(404).send({ msg: "Endpoint not found" });
};

exports.getArticleByIdController = (req, res, next) => {
  const { article_id } = req.params;
  getArticleByIdModel(article_id)
    .then((article) => {
      return res.status(200).send(article);
    })
    .catch(next);
};
