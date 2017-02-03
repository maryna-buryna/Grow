function getSimpleTagTemplate(tag) {
    return `<li data-tag-id="${tag._id}" class="tag simple-tags__item ${tag.active ? "simple-tags__item--selected simple-tags__item--active" : ""} ">${tag.title}</li>`
}

export default getSimpleTagTemplate;