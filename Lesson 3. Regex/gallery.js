/**
 * Класс галереи картинок, с предпросмотром и асинхронной загрузкой полных изображений.
 * 
 * @constructor  
 * @param sourceUrl Адрес загрузки данных
 */
function Gallery(sourceUrl) {
    BaseUiElement.call(this);
    this.sourceUrl = sourceUrl;
    this.previewsLoaded = false;
    this.galleryData = [];
}
Gallery.prototype = Object.create(BaseUiElement.prototype);
Gallery.prototype.constructor = Gallery;
Gallery.prototype.loadPreviews = function(onLoad) {
    if(this.previewsLoaded) return;
    
    Http.get(this.sourceUrl, function(galleryData) {
        this.galleryData = galleryData;
        this.previewsLoaded = true;
        onLoad();
    });
}
Gallery.prototype.render = function() {
    var gallery = this;     
    var loadingWrapper = document.createElement('div');
    if(!this.previewsLoaded) {
        loadingWrapper.innerHTML = "Loading preview";
        loadingWrapper.classList.add('loading');
    }

    this.loadPreviews(function () {   
        loadingWrapper.innerHTML = '';
        loadingWrapper.classList.remove('loading');

        this.galleryData.forEach(function(element) {
            var preview = new Image(element.thumb);
            preview.addClass('preview');
            var link = new ActionLink(preview, function() {
                var fullImg = new Image(element.full);                
                Popup.show(fullImg);
            });
            loadingWrapper.appendChild(link.render());
        });
    });

    return loadingWrapper;
}