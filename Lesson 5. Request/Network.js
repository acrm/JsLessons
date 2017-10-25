/**
 * Визуальный элемент, отображающий заглушку на месте контента,
 * загрузка которого может занять некоторое время. После загрузки 
 * на месте заглушки отображается загруженный контент.
 * 
 * @constructor
 * @param {UiBaseElement} placeholder Контент-заглушка
 */
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
      this.wrapper.classList.remove('loading');
  }
  if(this.wrapper) {
    this.wrapper.appendChild(completeContentProvider());
  }
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

function Http() {}
Http.get = function(url, onDone) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(){
        if(xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                var responseData = JSON.parse(xhr.responseText);
                onDone(null, responseData);
            }
            else {
              var err = 'Запрос выполнился с ошибкой, код: ' + xhr.status;
              onDone(err, responseData);
            }
        }
    };
    xhr.open('GET', url, true);
    xhr.send();
}
