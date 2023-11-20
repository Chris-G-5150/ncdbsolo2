const { getTopicsModel } = require("../models/newsModels");

exports.getTopicsController = (req, res, next) => {
  getTopicsModel()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch(next);
};

