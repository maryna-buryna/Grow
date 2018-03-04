import './../services/notify.settings';

import urlConfig from './../services/url.config'
import helperService from './../services/helper.service'
import articleRequest from './../services/article-request.service';

import tagsCtrl from './tags.ctrl';
import getArticleTemplate from './../views/article.tpl';
import getSimpleArticleTemplate from './../views/simple-article.tpl';


class ArticleCtrl {

    constructor() {
        this.getArticleTemplate = getArticleTemplate;
        this.getSimpleArticleTemplate = getSimpleArticleTemplate;
    }

    // show/hide a new article form
    changeNewArticleDisplayState() {
        if ( $('body').find('.new-article').hasClass('new-article--hide') ) {
            let newArticleEl = $('body').find('.new-article');
            tagsCtrl.getAllTagsForArticle(newArticleEl, []); 
            $('body').find('.new-article :input').val('');
        }

        $('body').find('.new-article').toggleClass('new-article--hide');
    }
    
    // show updateArticle form 
    setArticleUpdatingState(event) {
        let currentArticleEl = $(event.target).closest('.article');
        let articleActiveTagsId = tagsCtrl.getArticleActiveTagsId(currentArticleEl);    
        currentArticleEl.toggleClass('article--modify');
        currentArticleEl.find('.article__title-input').val(currentArticleEl.find('.article__title').text());
        currentArticleEl.find('.article__description-input').val(currentArticleEl.find('.article__description').text());
        tagsCtrl.getAllTagsForArticle(currentArticleEl, articleActiveTagsId);
    }

    // close updateArticle form 
    setArticleReadOnlyState(event) {
        let articleEl = $(event.target).closest('.article')
        articleEl.removeClass('article--modify');
        tagsCtrl.removeArticleNonActiveTags(articleEl);
    }

    updateArticle(event) {
        let currentArticleEl = $(event.target).closest('.article');
        let articleID = currentArticleEl.data('id');
        let articleData = {};
        articleData.title = currentArticleEl.find('.article__title-input').val();
        articleData.description = currentArticleEl.find('.article__description-input').val();
        articleData.tags = tagsCtrl.getArticleSelectedTagsId(currentArticleEl);
        articleData.modified = new Date();  

        var promise = articleRequest.updateArticleRequest(articleID, articleData);
            promise.then((data) => {
                currentArticleEl.find('.article__title').text(articleData.title);
                currentArticleEl.find('.article__description').text(articleData.description);
                currentArticleEl.find('.details__more-link').attr('href', articleID);
                currentArticleEl.toggleClass('article--modify');
                tagsCtrl.removeArticleNonSelectedTags(currentArticleEl);
                noty({ text: 'article is updated', type: 'success' });
            })
            .catch(() => {
                noty({ text: 'updating error', type: 'error' });
            })
    }

    // fetch delete
    deleteArticle(event) {
        let articleDOM = $(event.target).closest('.article');
        let articleId = articleDOM.data("id");

        var promise = articleRequest.articleDeleteRequest(articleId);
            promise
                .then((data) => {
                    articleDOM.closest('.articles__item').remove();
                    noty({ text: 'article is deleted', type: 'success' });
                })
                .catch(() => {
                    noty({ text: 'deleted error', type: 'error' });
                })
    }

    // send new article to server
    addArticle(event) {
        let self = this;
        let articleData = {};
        let currentArticle = $(event.target).closest('.new-article');
        articleData.title = currentArticle.find('.new-article__title').val();
        articleData.images = currentArticle.find('.new-article__image').val();        
        articleData.description = currentArticle.find('.new-article__description').val();
        articleData.tags = tagsCtrl.getArticleSelectedTagsId(currentArticle);
        articleData.author = "Maryna Buryna";

        var promise = articleRequest.articlePostRequest(articleData);
        promise
            .then((data) => {    
                console.log(data)
                self.getArticles();
                self.changeNewArticleDisplayState();
                noty({ text: 'article is added', type: 'success' });
            })
            .catch(() => {
                noty({ text: 'adding error', type: 'error' });
            })
    }


    getArticles() {
        let self = this; 
        let articlesContainer = $('body').find('.articles__list');
        articlesContainer.empty();

        var promise = articleRequest.getArticlesRequest();
            promise
                .then((data) => {
                    var articleTemplate='';
                    if (siteSettings.articleGridView ) {
                        var articleHTML = '';
                        for (let i = 0; i < data.length; i++) {
                            let article = data[i];
                            // let loop = Math.floor(i / siteSettings.columnsForLoop);
                            // let currentForm = siteSettings.articlesLoop[i % siteSettings.articlesLoop.length];
                            // articleTemplate = self.getSimpleArticleTemplate(article, currentForm[siteSettings.currentView], loop);
                            articleTemplate = self.getSimpleArticleTemplate(article);
                            
                            articleHTML += articleTemplate;

                        }
                        
                        articlesContainer.prepend(articleHTML);                        
                    } else {
                        for (let article of data) {
                            article.modified = helperService.timespanToHumanString(article.modified);
                            articleTemplate = self.getArticleTemplate(article);
                            articlesContainer.prepend(articleTemplate);                        
                            let articleEl = articlesContainer.find(`.article[data-id=${article._id}]`);
                            let tagPromise = [];
                            let tagsArr = [];
                            for (let tagId of article.tags) {
                                tagPromise.push(articleRequest.getArticleActiveTagRequest(tagsArr, tagId));
                            }
                            Promise.all(tagPromise)
                                .then(() => {
                                    for (let tag of tagsArr) {
                                        var tagTpl = tagsCtrl.getSimpleTagTemplate(tag);
                                        var tagsEl = articleEl.find(".simple-tags");
                                        tagsEl.append(tagTpl).find(`.simple-tags__item[data-tag-id=${tag._id}]`).addClass("simple-tags__item--blocked");
                                    } 
                                })
                            .catch(() => console.log("error"))
                        }
                            
                }
            })
    }


    showArticleDetails(event) {
        let articleId;
        event.preventDefault();
        if (!siteSettings.articleGridView) {
            articleId = $(event.target).closest(".article").data("id");
        } else {
            articleId = $(event.target).closest(".simple-article").data("id");
        }
        location.hash=articleId;
        this.getArticleDetails(articleId);
    }


    getArticleDetails(articleId) {
        let self = this;
        let articlesContainer = $('body').find('.articles');
        articlesContainer.empty();
        $.get(urlConfig.articleURL.getOne(articleId), function(data) {
            let article = data.article;
            article.modified = helperService.timespanToHumanString(article.modified);
            var articleTemplate = self.getArticleTemplate(article);
            articlesContainer.append(articleTemplate);
            let articleEl = articlesContainer.find(`.article[data-id=${article._id}]`);
            let tagPromise = [];
            let tagsArr = [];
                for (let tagId of article.tags) {
                    tagPromise.push(articleRequest.getArticleActiveTagRequest(tagsArr, tagId))
                }
                Promise.all(tagPromise)
                    .then(() => {
                        for (let tag of tagsArr) {
                            var tagTpl = tagsCtrl.getSimpleTagTemplate(tag);
                            var tagsEl = articleEl.find(".simple-tags");
                            tagsEl.append(tagTpl).find(`.simple-tags__item[data-tag-id=${tag._id}]`).addClass("simple-tags__item--blocked");
                        } 
                    })
                    .catch(() => console.log("error"))
        })
    }


    selectArticlesByActiveTag() {
        let activeTags = $(".active-tags-container .tag");
        let activeTagsId = [];
        for (let tag of activeTags) {
            activeTagsId.push($(tag).data("tag-id"));
        }
        if (activeTagsId[0]) {
            this.getArticlesByTags(activeTagsId);
        } else {
            this.getArticles();
        }
    }


    getArticlesByTags(activeTagsId) {
        let self = this;
        let articlesContainer = $('body').find('.articles__list');
        articlesContainer.empty();

        for (let tagId of activeTagsId) {
            let promise = articleRequest.getArticlesByTagRequest(tagId);
            promise
                .then((data) => {
                    for (let article of data) {
                        article.modified = helperService.timespanToHumanString(article.modified);
                        var articleTemplate = siteSettings.articleGridView ? self.getSimpleArticleTemplate(article) : self.getArticleTemplate(article);
                        articlesContainer.prepend(articleTemplate);
                        let articleEl = articlesContainer.find(`.article[data-id=${article._id}]`);

                        let tagPromise = [];
                        let tagsArr = [];
                        for (let tagId of article.tags) {
                            tagPromise.push(articleRequest.getArticleActiveTagRequest(tagsArr, tagId));
                        }
                        Promise.all(tagPromise)
                            .then(() => {
                                for (let tag of tagsArr) {
                                    var tagTpl = tagsCtrl.getSimpleTagTemplate(tag);
                                    var tagsEl = articleEl.find(".simple-tags");
                                    tagsEl.append(tagTpl).find(`.simple-tags__item[data-tag-id=${tag._id}]`).addClass("simple-tags__item--blocked");
                                } 
                            })
                            .catch(()=>console.log("error"))
                    }
                })
        }
    }

    changeArticleRepresentation(event) {
        if ($(event.target).hasClass('representation--active')) {
            return;
        }
        $(event.target).siblings().removeClass('representation--active');
        $(event.target).toggleClass('representation--active');
        $('body').find('.articles__list').toggleClass('simple-articles');
        siteSettings.articleGridView = !siteSettings.articleGridView;
        siteSettings.currentView = window.innerWidth < 540 ? 'mobile' : 'tablet';
        this.selectArticlesByActiveTag();
        
    }

    changeArticleView() {
        let newView = window.innerWidth < 540 ? 'mobile' : 'tablet';
        if (newView === siteSettings.currentView || !siteSettings.articleGridView) {
            return;
        } 
        siteSettings.currentView = newView;        
        var articlesList = $('body').find('.simple-article');
        for (var i=0; i < articlesList.length; i++) {
            let article = articlesList[i];
            let loop = Math.floor(i / siteSettings.columnsForLoop);
            let currentForm = siteSettings.articlesLoop[i % siteSettings.articlesLoop.length];
            $(article).attr('style', '');
            $(article).css({"grid-column": currentForm[siteSettings.currentView].gridColumns, "grid-row": currentForm[siteSettings.currentView    ].gridRows(loop)});
        }          
        
    }

}
export default new ArticleCtrl();