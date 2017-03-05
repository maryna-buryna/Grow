import urlConfig from './url.config.js'

class ArticleRequest {

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

}
export default new ArticleRequest();