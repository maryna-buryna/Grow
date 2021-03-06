import './styles/style.less';

import getPageTemplate from './scripts/views/page.tpl.js';
import articleCtrl from './scripts/controllers/article.ctrl.js';
import tagsCtrl from './scripts/controllers/tags.ctrl.js';

window.siteSettings = {
    articleGridView: false,
    currentView: 'mobile',

    rowsForLoop: {
        tablet: 3,
        mobile: 4
    },

    columnsForLoop: 7
};

$('body').on('click', '.articles__representation', (event) => { articleCtrl.changeArticleRepresentation(event) });


$('body').on('click', '.new-article__add-btn, .new-article__close-btn', articleCtrl.changeNewArticleDisplayState);
$('body').on('click', '.new-article__save-btn', (event) => { articleCtrl.addArticle(event) });
$('body').on('click', '.article__close-btn', articleCtrl.setArticleReadOnlyState);

$('body').on('click', '.article__update-btn', articleCtrl.setArticleUpdatingState);
$('body').on('click', '.article__save-btn', articleCtrl.updateArticle);

$('body').on('click', '.article__delete-btn', articleCtrl.deleteArticle);

$('body').on('click', '.tag__title', tagsCtrl.selectTag);
$('body').on('click', '.simple-tags__item:not(.simple-tags__item--blocked)', tagsCtrl.selectSimpleTag);

$('body').on('click', '.tags__add-btn', tagsCtrl.showAddTagInput);
$('body').on('keypress', '.tags__new-name', (event) => { tagsCtrl.addTag(event) });

$('body').on('click', '.tag__update-btn',  (event) => { tagsCtrl.changeTagUpdatingState(event) });
$('body').on('keypress', '.tag__title-input', (event) => { tagsCtrl.closeTagUpdatingState(event) });

$('body').on('click', '.tag__del-btn', (event) => { tagsCtrl.tagDeletingHandler(event) });

$('body').on('click', '.details__more-link, .simple-details__more-link', (event) => { articleCtrl.showArticleDetails(event) });
$('body').on('click', '.articles__show-btn', buildFullArticlePage);
``
var rtime;
var timeout = false;
var delta = 200;

$( window ).resize(function() {
    if (timeout === false) {
        timeout = true;
        setTimeout(() => {
            articleCtrl.changeArticleView()
            timeout = false;
        }, delta);
    }
});

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