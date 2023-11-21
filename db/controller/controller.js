const { getTopicsModel} = require("../models/newsModels");
const endPointsJSON = require("../../endpoints.json")

exports.getTopicsController = (req, res, next) => {
  console.log('hello', '<====getTopics')
  getTopicsModel()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch(next);
};

exports.handle404Controller = (req, res) => {
  return res.status(404).send({ msg: "Endpoint not found" });
};

exports.getInfoController = (req, res) => {
    return res.status(200).send({endPointsJSON})

};
