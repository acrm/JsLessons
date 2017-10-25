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
    this.loadingWrapper = new LoadingWrapper(new TextBlock('Loading preview'));
}
Gallery.prototype = Object.create(BaseUiElement.prototype);
Gallery.prototype.constructor = Gallery;
Gallery.prototype.loadPreviews = function() {
    var self = this;
    if(self.previewsLoaded) return;
    
    Http.get(self.sourceUrl, function(err, galleryData) {
        if(err) throw new Error(err);

        self.galleryData = galleryData ? galleryData : [];
        self.loadingWrapper.complete();
        self.previewsLoaded = true;
    });
}
Gallery.prototype.render = function() {
    var self = this;
    if(!self.previewsLoaded) {
        self.loadPreviews();
    }
    self.loadingWrapper.onComplete(function() {
        var container = new Container();
        self.galleryData.forEach(function(element) {
            var preview = new Image(element.thumb);
            preview.addClass('preview');
            preview.setData('product-id', element.productId);
            var link = new ActionLink(preview, function() {
                var fullImg = new Image(element.full);                
                Popup.show(fullImg);
            });
            container.addChild(link.render());
        });
        return container.render(); 
    });  
    
    return self.loadingWrapper.render();
}