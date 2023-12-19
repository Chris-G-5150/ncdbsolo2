exports.customErrorHandler = (err, req, res, next) => {
  
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

exports.handlePsqlErrors = (err, req, res, next) => {
  
  if (err.code === "23503") {
    res.status(404).send({ msg: "Article not found" });
  } else if (err.code === "22P02") {
    res.status(400).send({ msg: "Invalid request" });
  } else {
    next(err);
  }
};

exports.handleServerErrors = (err, req, res, next) => {
  
  res.status(500).send({ msg: "Internal Server Error" });
};
