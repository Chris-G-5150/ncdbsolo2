const db = require("../../db/connection.js");

exports.getTopicsModel = () => {
  return db.query("SELECT * FROM topics").then(({ rows }) => {
    return rows;
  });
};
