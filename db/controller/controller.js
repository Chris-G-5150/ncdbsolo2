const {
  fetchTopicsModel,
  fetchArticleByIdModel,
  fetchArticles,
  fetchArticleIdComments,
  insertArticleComment,
} = require("../models/newsModels");

const endPointsJSON = require("../../endpoints.json");

const { checkExists } = require("../secondaryUtils/utils");

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

  const promises = [fetchArticleIdComments(article_id)];
  if (article_id) {
    promises.push(checkExists("articles", "article_id", article_id));
  }

  Promise.all(promises)
    .then((resolvedPromises) => {
      const commentsOnArticles = resolvedPromises[0];
      res.status(200).send({ commentsOnArticles });
    })
    .catch(next);
};




exports.postArticleIdComments = (req, res, next) => {
  
  const {article_id} = req.params
  const newComment = req.body

  const promises = [insertArticleComment(newComment, article_id)]

  if (newComment) {
    promises.push(checkExists("users", "username", newComment.user))
    promises.push(checkExists("articles", "article_id", article_id))
  }



  
  Promise.all(promises)
  .then((resolvedPromises) => {
    const commentOnArticle = resolvedPromises[0]
    console.log(commentOnArticle, "<===== controller resolved promises")
    res.status(201).send(commentOnArticle)
  })

  .catch(next)
};
