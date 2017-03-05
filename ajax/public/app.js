import './styles/style.less';

import getPageTemplate from './scripts/views/page.tpl.js';
import articleCtrl from './scripts/controllers/article.ctrl.js';
import tagsCtrl from './scripts/controllers/tags.ctrl.js';


$('.articles').on('click', '.new-article__display-btn, .new-article__close-btn', articleCtrl.changeNewArticleDisplayState);
$('.articles').on('click', '.new-article__add-btn', (event) => { articleCtrl.addArticle(event) });

$('.articles').on('click', '.article__close-btn', articleCtrl.setArticleReadOnlyState);

$('.articles').on('click', '.article__update-btn', articleCtrl.setArticleUpdatingState);
$('.articles').on('click', '.article__save-btn', articleCtrl.updateArticle);

$('.articles').on('click', '.article__delete-btn', articleCtrl.deleteArticle);

$('.articles').on('click', '.tag__title', tagsCtrl.selectTag);
$('.articles').on('click', '.simple-tags__item:not(.simple-tags__item--blocked)', tagsCtrl.selectSimpleTag);

$('.articles').on('click', '.tags__add-btn', tagsCtrl.showAddTagInput);
$('.articles').on('keypress', '.tags__new-name', (event) => { tagsCtrl.addTag(event) });

$('.articles').on('click', '.tag__update-btn',  (event) => { tagsCtrl.changeTagUpdatingState(event) });
$('.articles').on('keypress', '.tag__title-input', (event) => { tagsCtrl.closeTagUpdatingState(event) });

$('.articles').on('click', '.tag__del-btn', (event) => { tagsCtrl.tagDeletingHandler(event) });

$('.articles').on('click', '.details__more-link', (event) => { articleCtrl.showArticleDetails(event) });
$('body').on('click', '.articles__show-btn', buildFullArticlePage);


$(document).ready(function() {
    buildPage();
});

function buildFullArticlePage(e) {
    e.preventDefault();
    location.hash = '';
    buildPage();
}

function buildPage() {
     if (location.hash) {
        articleCtrl.getArticleDetails(location.hash.slice(1))
    } else {
        let container = $('body').find('.articles');
        container.empty();
        var pageTemplate = getPageTemplate();
        container.prepend(pageTemplate);
        articleCtrl.getArticles();
        tagsCtrl.getTags();
    }
}