const db = require("../../db/connection.js");
const endpointsJSON = require("../../endpoints.json")

exports.getTopicsModel = () => {
  return db.query("SELECT * FROM topics").then(({ rows }) => {
    return rows;
  });
};


  

