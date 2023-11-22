const db = require("../../db/connection.js");

exports.getTopicsModel = () => {
  return db.query("SELECT * FROM topics").then(({ rows }) => {
    return rows;
  });
};

exports.getArticleByIdModel = (id) => {
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
