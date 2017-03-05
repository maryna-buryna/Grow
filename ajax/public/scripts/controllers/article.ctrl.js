import './../services/notify.settings.js';

import urlConfig from './../services/url.config.js'
import helperService from './../services/helper.service.js'
import articleRequest from './../services/article-request.service.js';

import tagsCtrl from './tags.ctrl.js';
import getArticleTemplate from './../views/article.tpl.js';


class ArticleCtrl {

    constructor(){
        this.getArticleTemplate = getArticleTemplate;
    }

    // show/hide a new article form
    changeNewArticleDisplayState() {
        let newArticleDisplayBtn = $('body').find('.new-article__display-btn');
        $('body').find('.new-article').toggleClass('display--hide');
        if (newArticleDisplayBtn.text() === 'add') {
            newArticleDisplayBtn.text('close');    
            let newArticleEl = $('body').find('.new-article');
            tagsCtrl.getAllTagsForArticle(newArticleEl, []); 
            $('body').find('.new-article :input').val('');
        } else {
            newArticleDisplayBtn.text('add');    
        }
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

        var promise = fetch(urlConfig.articleURL.getOne(articleId), { method: 'DELETE'});
            promise
                .then((response) => {
                    if (response.status === 200) {
                        return response.json();
                    } else {
                        return res.json().then(Promise.reject.bind(Promise));
                    }
                })
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
        articleData.description = currentArticle.find('.new-article__description').val();
        articleData.tags = tagsCtrl.getArticleSelectedTagsId(currentArticle);
        articleData.author = "Maryna Buryna";
        articleData.images = "../public/img/1.jpeg";

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

        var promise = fetch(urlConfig.articleURL.getAll(), { method: 'GET'});
        promise
            .then((response) => {
                if (response.status === 200) {
                    return response.json();
                } else {
                    return res.json().then(Promise.reject.bind(Promise));
                }
            })
            .then((data) => {
                for (let article of data) {
                    article.modified = helperService.timespanToHumanString(article.modified);
                    var articleTemplate = self.getArticleTemplate(article);
                    articlesContainer.prepend(articleTemplate);
                    let articleEl = articlesContainer.find(`.article[data-id=${article._id}]`);

                    let tagPromise = [];
                    let tagsArr = [];
                    for (let tagId of article.tags) {
                        tagPromise.push(
                            new Promise(function (resolve, reject) {
                                var xhr = new XMLHttpRequest();
                                xhr.open('GET', urlConfig.tagURL.getOne(tagId));
                                xhr.onload = function () {
                                    if (this.status >= 200 && this.status < 300) {
                                        let res = JSON.parse(xhr.responseText);
                                        res.tag.active = true;
                                        tagsArr.push(res.tag);
                                        resolve();
                                    } else {
                                        reject();
                                    }
                                }
                                xhr.send();
                            })
                        )
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

    showArticleDetails(event) {
        event.preventDefault();
        let articleId = $(event.target).closest(".article").data("id");
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
                    tagPromise.push(
                        new Promise(function (resolve, reject) {
                            var xhr = new XMLHttpRequest();
                            xhr.open('GET', urlConfig.tagURL.getOne(tagId));
                            xhr.onload = function () {
                                if (this.status >= 200 && this.status < 300) {
                                    let res = JSON.parse(xhr.responseText);
                                    tagsArr.push(res.tag);
                                    resolve();
                                } else {
                                    reject();
                                }
                            }
                            xhr.send();
                        })
                    )
                }

                Promise.all(tagPromise)
                    .then(() => {
                        for (let tag of tagsArr) {
                            tag.active = true;
                            var tagTpl = tagsCtrl.getSimpleTagTemplate(tag);
                            var tagsEl = articleEl.find(".simple-tags");
                            tagsEl.append(tagTpl).find(`.simple-tags__item[data-tag-id=${tag._id}]`).addClass("simple-tags__item--blocked");
                        } 
                    })
                    .catch(()=>console.log("error"))
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
            let promise = fetch(urlConfig.articleURL.getByTag(tagId), { method: 'GET'});
            promise
                .then((response) => {
                    if (response.status === 200) {
                        return response.json();
                    } else {
                        return res.json().then(Promise.reject.bind(Promise));
                    }
                })
                .then((data) => {
                    for (let article of data) {
                        article.modified = helperService.timespanToHumanString(article.modified);
                        var articleTemplate = self.getArticleTemplate(article);
                        articlesContainer.prepend(articleTemplate);
                        let articleEl = articlesContainer.find(`.article[data-id=${article._id}]`);

                        let tagPromise = [];
                        let tagsArr = [];
                        for (let tagId of article.tags) {
                            tagPromise.push(
                                new Promise(function (resolve, reject) {
                                    var xhr = new XMLHttpRequest();
                                    xhr.open('GET', urlConfig.tagURL.getOne(tagId));
                                    xhr.onload = function () {
                                        if (this.status >= 200 && this.status < 300) {
                                            let res = JSON.parse(xhr.responseText);
                                            res.tag.active = true;
                                            tagsArr.push(res.tag);
                                            resolve();
                                        } else {
                                            reject();
                                        }
                                    }
                                    xhr.send();
                                })
                            )
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

}
export default new ArticleCtrl();