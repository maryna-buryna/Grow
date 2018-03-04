function urlConfig() {
    return {
        articleURL: {
            url: `http://localhost:1337/api/articles`,
            getAll: function () {
                return this.url;
            },
            getOne: function (id) {
                return `${this.url}/${id}`;
            },
            getByTag: function (id) {
                return `${this.url}/tag/${id}`;
            }
        },        
        tagURL: {
            url: `http://localhost:1337/api/tags`,
            add: function () {
                return this.url;
            },
            getAll: function () {
                return this.url;
            },
            getOne: function (id) {
                return `${this.url}/${id}`;
            }
        }
    }
}
export default urlConfig();