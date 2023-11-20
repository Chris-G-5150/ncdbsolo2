

exports.handle404 = (err, req, res, next) => {
    return res.status(err.status).send({msg: err.msg})
}