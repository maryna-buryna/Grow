function getPageTemplate() {
    return `<section class="articles__tags active-tags-container">
                <ul class="tags__list">
                
                </ul>
            </section>

            <div class="articles__title-container">
                <h3 class="articles__title">top stories</h3>
                <button class="button new-article__display-btn">add</button>
            </div>

            <div class="new-article display--hide">
                <form class="new-article__form">
                    <h4 class="new-article__headline">Create new article</h4>
                    <input type="text" class="input-field new-article__title" placeholder="inter title" />
                    <textarea class="input-field new-article__description" placeholder="inter desctription" />
                    <ul class="new-article__simple-tags simple-tags"></ul>
                </form>

                <ul class="details control-buttons">
                    <li class="details__item control-buttons__item">
                        <button class="button new-article__add-btn">save</button>
                    </li>
                    <li class="details__item control-buttons__item">
                        <button class="button new-article__close-btn">close</button>
                    </li>
                </ul>
            </div>

            <ul class="articles__list">
            </ul>

            <section class="articles__tags tags whole-tags-container">
                <h3 class="tags__caption">Tags</h3>
                <ul class="tags__list">        
                </ul>
                <div class="tags__new">
                    <input type="text" class="tags__new-name" placeholder="tag"/>
                    <a href class="tags__add-btn">add</a>
            </section>`
}

export default getPageTemplate;