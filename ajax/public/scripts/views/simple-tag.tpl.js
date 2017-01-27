function getSimpleTagTemplate(tag) {
    return `<li data-tag-id="${tag._id}" class="simple-tags__item">${tag.title}</li>`
}

export default getSimpleTagTemplate;