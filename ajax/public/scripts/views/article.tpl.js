function getArticleTemplate(article) {
    return `<li class="articles__item">
                <article data-id="${article._id}" class="article">
                    <section class="article__information">

                        <div class="article__title-container">
                            <h4 class="article__title display--show">${article.title}</h4>
                            <input type="text" class="display--modify input-field article__title-input" placeholder="inter title" />
                        </div>

                        <div class="article__description-container">
                            <p class="article__description display--show">${article.description}</p>
                            <textarea class="display--modify input-field article__description-input" placeholder="inter desctription" />
                        </div>

                        <ul class="article__simple-tags simple-tags"></ul>

                        <div class="article__details">

                            <ul class="details">
                                <li class="details__item details__date">${article.modified}</li>
                                <li class="details__item details__more">
                                    <a href="${article._id}" class="details__more-link">read more</a>
                                </li>
                            </ul>

                            <ul class="details control-buttons">

                                <li class="details__item control-buttons__item">
                                    <button class="button article__delete-btn button__delete ">delete</button>
                                </li>
                                <li class="details__item control-buttons__item display--modify">
                                    <button class="button article__save-btn button__save">save</button>
                                </li>
                                <li class="details__item control-buttons__item display--show">
                                    <button class="button article__update-btn button__update">update</button>
                                </li>
                                <li class="details__item control-buttons__item display--modify">
                                    <button class="button article__close-btn button__close">close</button>
                                </li>
                            </ul>
                        </div>
                    </section>

                    <a href="#" class="article__author-link">
                        <img src="${article.images}" class="article__author-img">
                    </a>
                </article>
            </li>`
}

export default getArticleTemplate;