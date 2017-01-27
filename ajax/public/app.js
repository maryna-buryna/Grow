import './styles/style.less';

import helperService from './scripts/helper.service.js';
import urlConfig from './scripts/url.config.js'
import getArticleTemplate from './scripts/views/article.tpl.js';
import getTagTemplate from './scripts/views/tag.tpl.js';
import getSimpleTagTemplate from './scripts/views/simple-tag.tpl.js';
import getPageTemplate from './scripts/views/page.tpl.js';
import noty from './../node_modules/noty/js/noty/packaged/jquery.noty.packaged.min.js';

$.noty.defaults = {
    layout: 'top',
    theme: 'defaultTheme', // or 'relax'
    type: 'alert',
    text: '', // can be html or string
    dismissQueue: true, // If you want to use queue feature set this true
    template: '<div class="noty_message"><span class="noty_text"></span><div class="noty_close"></div></div>',
    animation: {
        open: { height: 'toggle' }, // or Animate.css class names like: 'animated bounceInLeft'
        close: { height: 'toggle' }, // or Animate.css class names like: 'animated bounceOutLeft'
        easing: 'swing',
        speed: 500 // opening & closing animation speed
    },
    timeout: false, // delay for closing event. Set false for sticky notifications
    force: false, // adds notification to the beginning of queue when set to true
    modal: false,
    maxVisible: 5, // you can set max visible notification for dismissQueue true option,
    killer: false, // for close all notifications before show
    closeWith: ['hover'], // ['click', 'button', 'hover', 'backdrop'] // backdrop click will close all notifications
    callback: {
        onShow: function() {},
        afterShow: function() {},
        onClose: function() {},
        afterClose: function() {},
        onCloseClick: function() {},
    },
    buttons: false // an array of buttons
};



$('.articles').on('click', '.new-article__display-btn, .new-article__close-form', changeNewArticleDisplayState);

$('.articles').on('click', '.button__close', setArticleReadOnlyState);
$('.articles').on('click', '.button__update', setArticleUpdatingState);

$('.articles').on('click', '.button__save', updateArticle);
$('.articles').on('click', '.button__delete', deleteArticle);

$('.articles').on('click', '.new-article__add-article', addArticle);

$('.articles').on('click', '.tag__title', selectTag);
$('.articles').on('click', '.simple-tags__item:not(.simple-tags__item--non-selected)', selectSimpleTag);

$('.articles').on('click', '.tags__add-btn', showAddTagInput);
$('.articles').on('keypress', '.tags__new-name', addTag);

$('.articles').on('click', '.tag__update-btn', tagUpdatingHandlerClick);
$('.articles').on('keypress', '.tag__title-input', tagUpdatingHandlerPress);

$('.articles').on('click', '.tag__del-btn', tagDeletingHandler);

$('.articles').on('click', '.details__more-link', showArticleDetails);

$(document).ready(function() {
    buildPageTemplate();
    getArticles();
    getTags();
});

function buildPageTemplate() {
    let container = $('body').find('.articles');
    container.empty();
    var pageTemplate = getPageTemplate();
    container.prepend(pageTemplate);
}


// show-hide form for creatng new article
function changeNewArticleDisplayState() {
    let newArticleDisplayBtn = $('body').find('.new-article__display-btn');
    newArticleDisplayBtn.text(newArticleDisplayBtn.text() === 'add' ? 'close' : 'add' );    
    $('body').find('.new-article').toggleClass('display--hide');
    $('body').find('.new-article input').val('');
    let newArticleEl = $('body').find('.new-article');
    getSimpleTagsRequest(newArticleEl); 
}

// close updateArticle form 
function setArticleReadOnlyState() {
    let articleEl = $(this).closest('.article')
    articleEl.removeClass('article--modify');
    removeArticleNonActiveTags(articleEl);
}

// show updateArticle form 
function setArticleUpdatingState() {
    let currentArticleEl = $(this).closest('.article');
    let articleTagsId = getArticleSelectedTagsId(currentArticleEl);    
    currentArticleEl.toggleClass('article--modify');
    currentArticleEl.find('.article__title-input').val(currentArticleEl.find('.article__title').text());
    currentArticleEl.find('.article__description-input').val(currentArticleEl.find('.article__description').text());
    getSimpleTagsRequest(currentArticleEl, setArticleSelectedTags, articleTagsId);
}

function updateArticle() {
    let self = $(this);
    let currentArticleEl = self.closest('.article');
    let articleID = currentArticleEl.data('id');
    let articleData = {};
    articleData.title = currentArticleEl.find('.article__title-input').val();
    articleData.description = currentArticleEl.find('.article__description-input').val();
    articleData.tags = getArticleSelectedTagsId(currentArticleEl);
    articleData.modified = new Date();  

    var promise = updateArticleRequest(articleID, articleData);
    promise.then((data) => {
            currentArticleEl.find('.article__title').text(articleData.title);
            currentArticleEl.find('.article__description').text(articleData.description);
            currentArticleEl.find('.details__more-link').attr('href', articleID);
            self.closest('.article').toggleClass('article--modify');
            removeArticleNonSelectedTags(currentArticleEl);
            noty({ text: 'article is updated', type: 'success' });
        })
        .catch(() => {
            noty({ text: 'updating error', type: 'error' });
        })
}

function updateArticleRequest(articleId, body) {
    let requestParams = {
        method: "PUT",
        body: JSON.stringify(body),
        headers: new Headers({ 'Content-Type': 'application/json' })
    }

    let myRequest = new Request(urlConfig.articleURL.getOne(articleId), requestParams);
    return fetch(myRequest)
        .then((response) => {
            if (response.status === 200) {
                return response.json();
            } else {
                return res.json().then(Promise.reject.bind(Promise));
            }
        });
}

function showArticleDetails () {
    let self = $(this);
    let articleId = $(this).closest(".article").data("id")
    let articlesPlace = $('body').find('.articles__list');
    articlesPlace.closest(".articles").empty();
    location.hash=articleId;
    $.get(urlConfig.articleURL.getOne(articleId), function(data) {
        let article = data.article;
        article.modified = helperService.timespanToHumanString(article.modified);
        var articleTemplate = getArticleTemplate(article);
        articlesPlace.prepend(articleTemplate);
        let articleEl = articlesPlace.find(`.article[data-id=${article._id}]`);
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
                        var tagTpl = getSimpleTagTemplate(tag);
                        var tagsEl = articleEl.find(".simple-tags");
                        tagsEl.append(tagTpl).find(`.simple-tags__item[data-tag-id=${tag._id}]`).addClass("simple-tags__item--active simple-tags__item--selected simple-tags__item--non-selected");
                   } 
                })
                .catch(()=>console.log("error"))
    })
}

function getArticles() {
    let self = $(this);
    let articlesPlace = $('body').find('.articles__list');
    articlesPlace.empty();

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
                var articleTemplate = getArticleTemplate(article);
                articlesPlace.prepend(articleTemplate);
                let articleEl = articlesPlace.find(`.article[data-id=${article._id}]`);

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
                            var tagTpl = getSimpleTagTemplate(tag);
                            var tagsEl = articleEl.find(".simple-tags");
                            tagsEl.append(tagTpl).find(`.simple-tags__item[data-tag-id=${tag._id}]`).addClass("simple-tags__item--active simple-tags__item--selected simple-tags__item--non-selected");
                    } 
                    })
                    .catch(()=>console.log("error"))
            }
        })
}

// fetch delete
function deleteArticle() {
    let self = $(this);
    let articleDOM = self.closest('.article');
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
function addArticle() {
    let self = $(this);
    let articleData = {};
    let currentArticle = self.closest('.new-article');
    articleData.title = currentArticle.find('.new-article__title').val();
    articleData.description = currentArticle.find('.new-article__description').val();
    articleData.tags = getArticleSelectedTagsId(currentArticle);
    articleData.author = "Maryna Buryna";
    articleData.images = "../public/img/1.jpeg";

    var promise = articlePostRequest(articleData);
    promise
        .then((data) => {    
            getArticles();
            changeNewArticleDisplayState();
            noty({ text: 'article is added', type: 'success' });
        })
        .catch(() => {
            noty({ text: 'adding error', type: 'error' });
        })
}

function articlePostRequest(body) {
    return new Promise(function(resolve, reject) {
        let xhr = new XMLHttpRequest();
        xhr.open("POST", urlConfig.articleURL.getAll());
        xhr.setRequestHeader('Content-Type', 'application/json')
        xhr.send(JSON.stringify(body));
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                if (xhr.status == 200) {
                    resolve();
                } else {
                    reject();
                }
            }
        }
    })
}

// tags

function getTags() {
    let self = $(this);
    let tagsPlace = $('body').find('.whole-tags-container .tags__list');
    tagsPlace.empty();
    var xhr = new XMLHttpRequest();
    xhr.open('GET', urlConfig.tagURL.getAll());
    xhr.send();
    
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status == 200) {
                let tagList = JSON.parse(xhr.responseText);
                for (let tag of tagList) {
                    var tagTpl = getTagTemplate(tag);
                    tagsPlace.append(tagTpl);
                }
            }
        }
    }
}

function getSimpleTagsRequest(articleEl, handler, tagIdList) {
    let tagContainer = articleEl.find(".simple-tags");
    tagContainer.empty();
    var xhr = new XMLHttpRequest();
    xhr.open('GET', urlConfig.tagURL.getAll());
    xhr.send();
    
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status == 200) {
                let tagList = JSON.parse(xhr.responseText);
                for (let tag of tagList) {
                    var tagTpl = getSimpleTagTemplate(tag);
                    tagContainer.append(tagTpl);
                }
                if (handler) {
                    handler(tagContainer, tagIdList);
                }
            }
        }
    }
}


function getArticleSelectedTagsId (artileEl) {   
    let tagsList = artileEl.find(".simple-tags__item--selected");
    let tagsIdList = [];
    for (let tag of tagsList) {
        tagsIdList.push($(tag).data("tag-id"))
    }
    return tagsIdList;
}

function getArticleActiveTags(container) {   
    let tagsList = container.find(".simple-tags__item--active");
    let tagsIdList = [];
    for (let tag of tagsList) {
        tagsIdList.push($(tag).data("tag-id"))
    }
    return tagsIdList;
}

function removeArticleNonActiveTags(container) {   
    let tagsList = container.find(".simple-tags__item");
    for (let tagEl of tagsList) {
        if (!$(tagEl).hasClass("simple-tags__item--active") ) {
            $(tagEl).remove();
        } else {
            $(tagEl).addClass("simple-tags__item--non-selected simple-tags__item--selected")
        }
    }
}

function removeArticleNonSelectedTags(container) {   
    let tagsList = container.find(".simple-tags__item");
    for (let tagEl of tagsList) {
        if (!$(tagEl).hasClass("simple-tags__item--selected") ) {
            $(tagEl).remove();
        } else {
            $(tagEl).addClass("simple-tags__item--non-selected")
        }
    }
}

function setArticleSelectedTags(tagContainer, articleTags) {   
    let tagsList = tagContainer.find(".simple-tags__item");
    for (let tag of tagsList) {
        for (let tagId of articleTags) {
            if ($(tag).data("tag-id") === tagId) {
                $(tag).addClass("simple-tags__item--selected simple-tags__item--active")
            }
        }
    }
}

function createTag(data, handler) {
    $.post(urlConfig.tagURL.add(), data, handler)
        .done(function(){
            noty({ text: 'article is added', type: 'success' });            
        })
        .fail(function() {
            noty({ text: 'creating error', type: 'error' });
        })
}

function selectTag(e) {
    var tagEl = $(this).closest(".tag");
    var tagId = tagEl.data("tag-id"); 
    if ( tagEl.hasClass("tag--selected") ) {
        $(`.active-tags-container .tag[data-tag-id='${tagId}']`).remove();
    } else {
        tagEl.clone().appendTo( ".active-tags-container .tags__list" );
    }
    tagEl.toggleClass("tag--selected");
}

function selectSimpleTag() {
    $(this).toggleClass("simple-tags__item--selected");
}


function showAddTagInput(e) {
    e.preventDefault();
    var container = $(this).closest(".tags__new");
    container.addClass("tags__new--entering");

    container.find(".tags__new-name").val("").focus();
    
}

function addTag(e) {
    if (e.keyCode === 13) {
        var self = $(this);
        var data = {
            title: $(this).val()
        };
        
        createTag(data, function() {
            self.closest(".tags__new").removeClass("tags__new--entering");
            var tagTpl = getTagTemplate(data);
            self.closest(".tags").find(".tags__list").append(tagTpl);
        });

    }
}


// updating tag
function tagUpdatingHandlerClick(e) {   
    e.stopPropagation();
    $(this).closest(".tag").toggleClass("tag--updating");
    if ($(this).text() === "save") {
        updateTag(this);
        $(this).text("update");         
    } else {
        let tagTitle = $(this).closest(".tag").find(".tag__title").text();
        $(this).closest(".tag").find(".tag__title-input").val(tagTitle).focus();
        $(this).text("save");
    }
}

function tagUpdatingHandlerPress(e) {
    if (e.keyCode === 13) {
        updateTag(this);
        $(this).closest(".tag").toggleClass("tag--updating");
        $(this).closest(".tag").find(".tag__update-btn").text("update");
        
    }
}

function updateTag(self) {
    let data = {
        title: $(self).closest(".tag").find(".tag__title-input").val()
    }
    let tagId = $(self).closest(".tag").data("tag-id"); 
    updateTagRequest(tagId, data)
}

// (jquery) tag update request
function updateTagRequest(tagId, data) {
    $.ajax({
        url: urlConfig.tagURL.getOne(tagId),
        method: "PUT",
        data: data,
        crossDomain: true,
        success: function() {
            noty({ text: 'tag is updated', type: 'success' });
            $(`.tag[data-tag-id='${tagId}']`).find(".tag__title").text(data.title);
            $(`.simple-tags__item[data-tag-id='${tagId}']`).text(data.title);
        },
        error: function() {
            noty({ text: 'updating error', type: 'error'});
        }
    })
}


// delete tag
function tagDeletingHandler() {
    let self = $(this);
    let tagId = $(this).closest(".tag").data("tag-id");
    deleteTagRequest(tagId)
}


function deleteTagRequest(tagId) {
    var xhr = new XMLHttpRequest();
    xhr.open('DELETE', urlConfig.tagURL.getOne(tagId));
    xhr.send();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status == 200) {
                noty({ text: 'tag is deleted', type: 'success' });
                $(`.tag[data-tag-id='${tagId}']`).remove();
            } else {
                noty({ text: 'deleting error', type: 'error' });
            }
        }
    }
}


