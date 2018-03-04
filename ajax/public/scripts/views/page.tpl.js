function getPageTemplate() {

    return `<section class="articles__tags active-tags-container">
                <ul class="tags__list">
                
                </ul>
            </section>

            <div class="articles__title-container">
                <h3 class="articles__title">top stories</h3>
                <ul class="">
                    <li class="articles__representation grid-representation"></li>
                    <li class="articles__representation list-representation representation--active "></li>               
                </ul>
            </div>

            <ul class="articles__list">
            
            </ul>`
}

export default getPageTemplate;