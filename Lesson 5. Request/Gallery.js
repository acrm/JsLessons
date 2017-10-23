function LoadingWrapper(placeholder) {
    BaseUiElement.call(this);
    this.placeholder = placeholder;
    this.placeholderElement = null;
    this.isRendered = false;
    this.isComplete = false;
    this.completeContentProvider = null;
    this.wrapper = null;
}
LoadingWrapper.prototype = Object.create(BaseUiElement.prototype);
LoadingWrapper.prototype.constructor = LoadingWrapper;
LoadingWrapper.prototype.replacePlaceholder = function(completeContentProvider) { 
    if(this.placeholderElement) {
        this.wrapper.removeChild(this.placeholderElement);
    }
    this.wrapper.classList.remove('loading');
    this.wrapper.appendChild(completeContentProvider());
}
LoadingWrapper.prototype.render = function() {
    this.wrapper = document.createElement('div');
    if(!this.isComplete || !this.completeContentProvider) {
        this.placeholderElement = BaseUiElement.renderSomething(this.placeholder);
        this.wrapper.appendChild(this.placeholderElement);
        this.wrapper.classList.add('loading');
    }
    else if(this.completeContentProvider) {
        this.replacePlaceholder(this.completeContentProvider);
    }
    
    this.isRendered = true;
    return this.wrapper;
}
LoadingWrapper.prototype.complete = function() {
    this.isComplete = true;
    if(this.completeContentProvider){
        this.replacePlaceholder(this.completeContentProvider);
    }
}
LoadingWrapper.prototype.onComplete = function(completeContentProvider) {
    this.completeContentProvider = completeContentProvider;
    if(this.isComplete && this.isRendered) {        
        this.replacePlaceholder(this.completeContentProvider);       
    }
}


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
    
    Http.get(self.sourceUrl, function(galleryData) {
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