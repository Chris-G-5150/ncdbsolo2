const db = require("../../db/connection.js");

exports.fetchTopicsModel = () => {
  return db.query("SELECT * FROM topics").then(({ rows }) => {
    return rows;
  });
};

exports.fetchArticleByIdModel = (id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1;", [id])
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({
          status: 404,
          msg: "No article found with that ID",
        });
      } else {
        return rows[0];
      }
    });
};

exports.fetchArticles = () => {
  return db.query(`
  SELECT
  articles.author, 
  articles.title, 
  articles.article_id, 
  articles.topic, 
  articles.created_at, 
  articles.votes, 
  articles.article_img_url, 
  COUNT(comments.article_id) AS comment_count
  FROM articles 
  LEFT JOIN comments 
  ON articles.article_id = comments.article_id
  GROUP BY articles.article_id
  ORDER BY articles.created_at DESC;`)
  .then(({rows}) => {
    return rows
  })
};

exports.fetchArticleIdComments = (articleId) => {
  return db.query(`
  SELECT * FROM comments
  WHERE comments.article_id = $1
  ORDER BY comments.created_at DESC;
  `, [articleId])
  .then(({rows}) => {
    return rows
  })
}
