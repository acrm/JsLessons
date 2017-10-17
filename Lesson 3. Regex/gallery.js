function Popup() { }
Popup.show = function (contentElement) {
    var popupOverlay = document.createElement('div');
    popupOverlay.id = 'popup-overlay';
    popupOverlay.classList.add('popup-overlay');

    var popup = document.createElement('div');
    popup.classList.add('popup');

    if(typeof contentElement === 'String') {
        popup.innerHTML = contentElement;
    }
    else if(contentElement instanceof BaseUiElement) {
        popup.appendChild(contentElement.render());
    }

    popupOverlay.appendChild(popup);
    
    var close = new ActionLink(function() { popupOverlay.remove(); }, 'x');
    close.className = 'popup-close';
    popupOverlay.appendChild(close.render());
    
    document.body.appendChild(popupOverlay);
}

function Http() {}
Http.get = function(url, onDone) {
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

/**
 * Класс галереи картинок, с предпросмотром и асинхронной загрузкой полных изображений.
 * 
 * @constructor  
 * @param sourceUrl Адрес загрузки данных
 */
function Gallery(id, className, sourceUrl) {
    Container.call(this, id, className, []);
    this.sourceUrl = sourceUrl;
    this.previewsLoaded = false;
    this.galleryData = [];
}
Gallery.prototype = Object.create(Container.prototype);
Gallery.prototype.constructor = Gallery;
Gallery.prototype.loadPreviews = function(onLoad) {
    if(this.previewsLoaded) return;
    
    Http.get(this.sourceUrl, function(galleryData) {
        this.galleryData = galleryData;
        this.previewsLoaded = true;
        onLoad();
    });
}
Gallery.prototype.renderWrapper = function() {
    var loadingWrapper = document.createElement('div');
    if(!this.previewsLoaded) {
        loadingWrapper.innerHTML = "Loading preview";
        loadingWrapper.classList.add('loading');
    }

    this.loadPreviews(function () {        
        var container = document.createElement('div');

        this.galleryData.forEach(function(element) {
            var img = document.createElement('img');
            img.src = data.thumb;
            img.classList.add('preview');            
            img.onclick = function() {
                var img = document.createElement('img');
                img.src = data.full;
                
                Popup.show(img);
            }
            this.children.push(img);
        });
        loadingWrapper.innerHTML = '';
        loadingWrapper.classList.remove('loading');
    });

    return loadingWrapper;
}