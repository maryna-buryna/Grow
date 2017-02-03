var express       = require('express');
var articleCtrl   = require('./../controllers/article.ctrl');

var articleRouter = express.Router();

articleRouter.use('/', articleCtrl.setHeaders);

articleRouter.route('/')
    .options(articleCtrl.setOptions)
    .get(articleCtrl.getArticles)
    .post(articleCtrl.postArticle);

articleRouter.route('/:id')
    .options(articleCtrl.setOptions)
    .get(articleCtrl.getArticle)
    .put(articleCtrl.updateArticle)
    .delete(articleCtrl.deleteArticle)

articleRouter.route('/tag/:id')
    .get(articleCtrl.getArticlesByTag)

articleRouter
    .use(articleCtrl.notFound)
    .use(articleCtrl.internalError);
module.exports = articleRouter;
