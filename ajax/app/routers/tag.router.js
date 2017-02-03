var express       = require('express');
var tagCtrl   = require('./../controllers/tag.ctrl');

var tagRouter = express.Router();
var deleteTagRouter = express.Router();

tagRouter.use('/', tagCtrl.setHeaders);

tagRouter.route('/')
    .get(tagCtrl.getTags)
    .post(tagCtrl.postTag);
    
tagRouter.route('/:id')
    .options(tagCtrl.setOptions)
    .get(tagCtrl.getTag)
    .put(tagCtrl.updateTag)
    

tagRouter
    .delete('/:id', tagCtrl.deleteTag)
    .use('/:id', tagCtrl.deleteTagFromArticle);

tagRouter
    .use(tagCtrl.notFound)
    .use(tagCtrl.internalError);

module.exports = tagRouter;
