function getSimpleArticleTemplate(article, viewSettings, loop) {
    return `<li data-id="${article._id}" class="simple-article" style="grid-column: ${viewSettings.gridColumns}; grid-row: ${viewSettings.gridRows(loop)}">
                <a href="#" class="simple-details__more-link" style="background-image: url(${article.images}); ">
                    <h4 class="simple-article__title">${article.title}</h4>
                </a>
            </li>`
}

export default getSimpleArticleTemplate;