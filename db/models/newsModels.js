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
  return db
    .query(
      `
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
  ORDER BY articles.created_at DESC;`
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.fetchArticleIdComments = (articleId) => {
  return db
    .query(
      `
    SELECT * FROM comments
    WHERE comments.article_id = $1
    ORDER BY comments.created_at DESC;
    `,
      [articleId]
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.insertArticleComment = (commentToPost, articleId) => {
  return db
    .query(
      `INSERT INTO comments(author, body, article_id) VALUES($1, $2, $3) RETURNING *;`,
      [commentToPost.user, commentToPost.body, articleId]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.patchArticleVotes = (voteCountChange, articleId) => {
  if (typeof voteCountChange.inc_votes === "number") {
    return db
      .query(
        `
        UPDATE articles 
        SET votes = votes + $1 
        WHERE article_id = $2
        RETURNING *;`,
        [voteCountChange.inc_votes, articleId]
      )

      .then(({ rows }) => {
        return rows[0];
      });
  } else
    return Promise.reject({
      status: 400,
      msg: "Bad request",
    });
};

exports.deleteComment = (commentId) => {
  return db
    .query(
      `
    DELETE FROM comments
    WHERE comment_id = $1
    RETURNING*;`,
      [commentId]
    )
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({
          status: 404,
          msg: "comment not found",
        });
      }
    });
};



exports.fetchUsers = () => {
  return db
    .query(`
    SELECT * FROM users;`)
    .then(({rows}) => {
      console.log(rows, "rows in model")
      return rows
      
    });
}

exports.selectApiArticles = (topic) => {
  let queryString = `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments) AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id`;
  const queryValues = [];
  if (topic) {
    queryValues.push(topic);
    queryString += ` WHERE topic = $1 GROUP BY articles.article_id ORDER BY created_at DESC; `;
    return db.query(queryString, queryValues).then((result) => {
      return result.rows;
    });
  } else {
    queryString += ` GROUP BY articles.article_id ORDER BY created_at DESC `;
    return db.query(queryString, queryValues).then((result) => {
      return result.rows;
    });
  }
};