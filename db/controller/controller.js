const {
    fetchTopicsModel,
    fetchArticleByIdModel,
    fetchArticles,
    fetchArticleIdComments,
    insertArticleComment,
    patchArticleVotes,
    deleteComment,
    fetchUsers,
    selectApiArticles,
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
    console.log(req, "<<<<handle404 in controllers");
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
    const {topic} = req.query
    fetchArticles(topic).then((articleList) => {
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
    const { article_id } = req.params;
    const newComment = req.body;

    const promises = [insertArticleComment(newComment, article_id)];

    if (newComment) {
        promises.push(checkExists("users", "username", newComment.user));
        promises.push(checkExists("articles", "article_id", article_id));
    }

    Promise.all(promises)
        .then((resolvedPromises) => {
            const commentOnArticle = resolvedPromises[0];
            res.status(201).send(commentOnArticle);
        })

        .catch(next);
};

exports.updateArticleVotes = (req, res, next) => {
    const { article_id } = req.params;

    const voteChange = req.body;

    const promises = [patchArticleVotes(voteChange, article_id)];

    if (article_id) {
        promises.push(checkExists("articles", "article_id", article_id));
    }

    Promise.all(promises)
        .then((resolvedPromises) => {
            const updateArticleVotes = resolvedPromises[0];
            res.status(200).send(updateArticleVotes);
        })
        .catch(next);
};

exports.deleteCommentById = (req, res, next) => {
    const { comment_id } = req.params;

    return deleteComment(comment_id)
        .then(() => {
            res.status(204).send();
        })
        .catch(next);
};

exports.getUsers = (req, res, next) => {
    return fetchUsers()
        .then((users) => {
            res.status(200).send(users);
        })

        .catch(next);
};

// exports.getApiArticles = (req, res, next) => {
//     const { topic } = req.query;
//     selectApiArticles(topic)
//         .then((articles) => {
//             res.status(200).send({ articles });
//         })
//         .catch(next);
// };
