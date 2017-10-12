// Label
function Label(text) {
    Container.call(this);
    
    this.text = text;
}
Label.prototype = Object.create(Container.prototype);
Label.prototype.constructor = Label;
Label.prototype.render = function() {
    var span = document.createElement('span');
    span.innerHTML = this.text;
    return span;
}

/**
 * Класс галереи картинок, с предпросмотром и асинхронной загрузкой полных изображений.
 * 
 * @constructor  
 * @param sourceUrl Адрес загрузки данных
 */
function Gallery(sourceUrl) {
    Container.call(this);
    this.sourceUrl = sourceUrl;
    this.previewsLoaded = false;
    this.galleryData = [];
}
Gallery.prototype = Object.create(Container.prototype);
Gallery.prototype.constructor = Gallery;
Gallery.prototype.get = function(url, onDone) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(){
        if(xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                var responseData = JSON.parse(xhr.responseText);
                onDone(responseData);
            }
        }
    };
    xhr.open('GET', url, true);
    xhr.send();
}
Gallery.prototype.loadPreviews = function(onLoad) {
    if(this.previewsLoaded) return;
    
    this.get(this.sourceUrl, function(galleryData) {
        this.galleryData = galleryData;
        this.previewsLoaded = true;
        onLoad();
    });
}
Gallery.prototype.showFull = function (fullUrl) {
    var popupOverlay = document.createElement('div');
    popupOverlay.id = 'popup-overlay';
    popupOverlay.classList.add('popup-overlay');

    var popup = document.createElement('div');
    popup.classList.add('popup');

    var img = document.createElement('img');
    img.src = fullUrl;
    popup.appendChild(img);
    popupOverlay.appendChild(popup);
    
    var close = new ActionLink(function() { popupOverlay.remove(); }, 'x');
    close.className = 'popup-close';
    popupOverlay.appendChild(close.render());
    
    document.body.appendChild(popupOverlay);
}
Gallery.prototype.render = function() {
    var gallery = this;
    var loadingWrapper = document.createElement('div');
    if(!this.previewsLoaded) {
        loadingWrapper.innerHTML = "Loading preview";
        loadingWrapper.classList.add('loading');
    }

    this.loadPreviews(function () {        
        var container = document.createElement('div');
        this.galleryData.forEach(function(element) {
            var bind = function(data) {
                var img = document.createElement('img');
                img.src = data.thumb;
                img.classList.add('preview');            
                img.onclick = function() {
                    gallery.showFull(data.full);
                }
                
                container.appendChild(img);
            }
            bind(element);
        });
        loadingWrapper.innerHTML = '';
        loadingWrapper.classList.remove('loading');
        loadingWrapper.appendChild(container);
    });

    return loadingWrapper;
}

