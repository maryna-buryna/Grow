import urlConfig from './url.config.js'

class ArticleRequest {

    getArticleActiveTagRequest(tagsArr, tagId) {
       return new Promise(function (resolve, reject) {
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
    }


    articleDeleteRequest(articleId) {
        return new Promise(function(resolve, reject) {
            let xhr = new XMLHttpRequest();
            xhr.open("DELETE", urlConfig.articleURL.getOne(articleId));
            xhr.send();
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


    updateArticleRequest(articleId, body) {
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

    // send post request
    articlePostRequest(body) {
        return new Promise(function(resolve, reject) {
            let xhr = new XMLHttpRequest();
            xhr.open("POST", urlConfig.articleURL.getAll());
            xhr.setRequestHeader('Content-Type', 'application/json')
            xhr.send(JSON.stringify(body));
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                    if (xhr.status == 200) {
                        resolve(body);
                    } else {
                        reject();
                    }
                }
            }
        })
    }

    getArticlesRequest() {
       return new Promise(function (resolve, reject) {
            debugger;
            var xhr = new XMLHttpRequest();
            xhr.open('GET', urlConfig.articleURL.getAll());
            xhr.onload = function () {
                if (this.status >= 200 && this.status < 300) {
                    let res = JSON.parse(xhr.responseText);
                    resolve(res);
                } else {
                    reject();
                }
            }
            xhr.send();
        })
    }

    getArticlesByTagRequest(tagId) {
       return new Promise(function (resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', urlConfig.articleURL.getByTag(tagId));
            xhr.onload = function () {
                if (this.status >= 200 && this.status < 300) {
                    let res = JSON.parse(xhr.responseText);
                    resolve(res);
                } else {
                    reject();
                }
            }
            xhr.send();
        })
    }

}

export default new ArticleRequest();