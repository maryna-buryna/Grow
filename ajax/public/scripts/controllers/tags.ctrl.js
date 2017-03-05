import './../services/notify.settings.js';

import urlConfig from './../services/url.config.js'
import getTagTemplate from './../views/tag.tpl.js';
import getSimpleTagTemplate from './../views/simple-tag.tpl.js';

import articleCtrl from './article.ctrl.js';


class TagsCtrl {
    constructor(){
        this.getSimpleTagTemplate = getSimpleTagTemplate;
        this.getTagTemplate = getTagTemplate;
    }

    selectSimpleTag(event) {
        $(event.target).toggleClass("simple-tags__item--selected");
    }

    // get all tags
    getAllTagsForArticle(articleEl, activeTagIdList) {
        let self = this;
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
                        tag.active = activeTagIdList.includes(tag._id); 
                        var tagTpl = self.getSimpleTagTemplate(tag);
                        tagContainer.append(tagTpl);
                    }                
                }
            }
        }
    }


    //define current article active tags
    getArticleActiveTagsId(artileEl) {   
        let tagsList = artileEl.find(".simple-tags__item--active");
        let tagsIdList = [];
        for (let tag of tagsList) {
            tagsIdList.push($(tag).data("tag-id"))
        }
        return tagsIdList;
    }
    
    //define selected tags    
    getArticleSelectedTagsId(artileEl) {    
        let tagsList = artileEl.find(".simple-tags__item--selected");
        let tagsIdList = [];
        for (let tag of tagsList) {
            tagsIdList.push($(tag).data("tag-id"))
        }
        return tagsIdList;
    }

    // remove non active tags from article
    removeArticleNonActiveTags(container) {   
        let tagsList = container.find(".simple-tags__item");
        for (let tagEl of tagsList) {
            if (!$(tagEl).hasClass("simple-tags__item--active") ) {
                $(tagEl).remove();
            } else {
                $(tagEl).addClass("simple-tags__item--blocked simple-tags__item--selected")
            }
        }
    }

    // remove non selected tags from article
    removeArticleNonSelectedTags(container) {   
        let tagsList = container.find(".simple-tags__item");
        for (let tagEl of tagsList) {
            if (!$(tagEl).hasClass("simple-tags__item--selected") ) {
                $(tagEl).remove();
            } else {
                $(tagEl).addClass("simple-tags__item--active simple-tags__item--blocked")            
            }
        }
    }

    getTags() {
        let self = this;
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
                        var tagTpl = self.getTagTemplate(tag);
                        tagsPlace.append(tagTpl);
                    }
                }
            }
        }
    }
   

    selectTag(event) {
        var tagEl = $(event.target).closest(".tag");
        var tagId = tagEl.data("tag-id"); 
        if ( tagEl.hasClass("tag--selected") ) {
            $(`.active-tags-container .tag[data-tag-id='${tagId}']`).remove();
        } else {
            tagEl.clone().appendTo( ".active-tags-container .tags__list" );
        }
        tagEl.toggleClass("tag--selected");
        articleCtrl.selectArticlesByActiveTag();
    }


    showAddTagInput(event) {
        event.preventDefault();
        var container = $(event.target).closest(".tags__new");
        container.addClass("tags__new--entering");
        container.find(".tags__new-name").val("").focus();
    }

    addTag(event) {
        if (event.keyCode === 13) {
            var data = {
                title: $(event.target).val()
            };
            
            this.createTag(data, $(event.target), this)
        }
    }

    createTag(data, tagEl, self) {
        $.post(urlConfig.tagURL.add(), data, tagEl)
            .done(function(data){
                noty({ text: 'article is added', type: 'success' }); 
                tagEl.closest(".tags__new").removeClass("tags__new--entering");
                var tagTpl = self.getTagTemplate(data.tag);
                tagEl.closest(".tags").find(".tags__list").append(tagTpl);           
            })
            .fail(function() {
                noty({ text: 'creating error', type: 'error' });
            })
    }

// updating tag
changeTagUpdatingState(event) {   
    event.stopPropagation();
    let targetEl = $(event.target);
    targetEl.closest(".tag").toggleClass("tag--updating");
    if (targetEl.text() === "save") {
        this.updateTag(targetEl);
        targetEl.text("update");         
    } else {
        let tagTitle = targetEl.closest(".tag").find(".tag__title").text();
        targetEl.closest(".tag").find(".tag__title-input").val(tagTitle).focus();
        targetEl.text("save");
    }
}

closeTagUpdatingState(event) {
    if (event.keyCode === 13) {
        this.updateTag(event.target);
        $(event.target).closest(".tag").toggleClass("tag--updating");
        $(event.target).closest(".tag").find(".tag__update-btn").text("update");
    }
}

updateTag(tagEl) {
    let data = {
        title: $(tagEl).closest(".tag").find(".tag__title-input").val()
    }
    let tagId = $(tagEl).closest(".tag").data("tag-id"); 
    this.updateTagRequest(tagId, data)
}

// (jquery) tag update request
updateTagRequest(tagId, data) {
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
tagDeletingHandler(event) {
    let tagId = $(event.target).closest(".tag").data("tag-id");
    var xhr = new XMLHttpRequest();
    xhr.open('DELETE', urlConfig.tagURL.getOne(tagId));
    xhr.send();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status == 200) {
                noty({ text: 'tag is deleted', type: 'success' });
                $(`.tag[data-tag-id='${tagId}']`).remove();
                articleCtrl.selectArticlesByActiveTag();
            } else {
                noty({ text: 'deleting error', type: 'error' });
            }
        }
    }
}




}
export default new TagsCtrl();