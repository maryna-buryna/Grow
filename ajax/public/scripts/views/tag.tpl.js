function getTagTemplate(tag) {
    return `<li data-tag-id="${tag._id}" class="tags__item tag">
                <div class="tag__title-container">
                    <p class="tag__title">${tag.title}</p>
                    <input type="text" class="input-field tag__title-input" placeholder="inter title" />
                </div>
                <ul class="tag__ctrl-btns">
                    <li class="tag__update-btn tag__btn">update</li>
                    <li class="tag__del-btn tag__btn">delete</li>
                </ul>
            </li>`
}

export default getTagTemplate;