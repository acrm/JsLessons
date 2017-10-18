function UiException(message) {
    Error.call(this, message);
}

UiException.prototype = Object.create(Error.prototype);
UiException.prototype.constructor = UiException;

/**
 * Базовый элемент UI. Определяют общие методы. Непереопределённая отрисовка вызывает ошибку.
 * 
 * @constructor
 * @param {String} id Идентификатор 
 * @param {String} className Имя класса
 */
function BaseUiElement() {
    this.id = null;
    this.classList = [];
}
BaseUiElement.prototype.setId = function(id) {
    this.id = id;
    return this;
}
BaseUiElement.prototype.addClass = function(className) {
    this.classList.push(className);
    return this;
}
BaseUiElement.prototype.applyBaseProperties = function(element) {
    if(this.id) {
        element.id = this.id;
    } 
    this.classList.forEach(function(className) {
        element.classList.add(className);
    });
}
/**
 * Отрисовка элемента. Метод должен быть переопределен в дочерних классах.
 * @throws {UiException} Вызов приводит к исключению.
 */
BaseUiElement.prototype.render = function() {
    throw new UiException("Нельзя отрисовать абстрактный элемент.");
}
BaseUiElement.prototype.remove = function() {
    if(this.id) {
        var container = document.getElementById(this.id);
        if(container) {
            container.remove();
        }
        else {
            throw new UiException("Элемент с id=" + this.id + " не добавлен в документ.");                        
        }
    }
    else {
        throw new UiException("Нельзя удалить элемент с отсутствующим id.");
    }
}

// Link
function Link(href, content) {
    BaseUiElement.call(this);
    
    this.href = href;
    this.content = content;
}
Link.prototype = Object.create(BaseUiElement.prototype);
Link.prototype.constructor = Link;
Link.prototype.render = function() {    
    var aHref = document.createElement('a');
    this.applyBaseProperties(aHref);
    aHref.href = this.href;
    
    if(typeof this.content === 'String') {
        aHref.innerHTML = this.content;
    }
    else if(this.content instanceof BaseUiElement) {
        aHref.appendChild(this.content.render());
    }
    
    return aHref;
}

// TextBlock
function TextBlock(text) {
    BaseUiElement.call(this);
    
    this.text = text;
}
TextBlock.prototype = Object.create(BaseUiElement.prototype);
TextBlock.prototype.constructor = TextBlock;
TextBlock.prototype.render = function() {
    var span = document.createElement('span');
    this.applyBaseProperties(span);
    span.innerHTML = this.text;
    return span;
}


// Image
function Image(source) {
    BaseUiElement.call(this);
    
    this.source = source;
}
Image.prototype = Object.create(BaseUiElement.prototype);
Image.prototype.constructor = Image;
Image.prototype.render = function() {
    var img = document.createElement('img');
    this.applyBaseProperties(img);
    img.src = this.source;
    return img; 
}

// ActionLink
function ActionLink(content, action) {
    Link.call(this, '#', content);
    
    this.action = action;
}
ActionLink.prototype = Object.create(Link.prototype);
ActionLink.prototype.baseRender = Link.prototype.render
ActionLink.prototype.constructor = ActionLink;
ActionLink.prototype.render = function() {
    var aHref = this.baseRender();
    aHref.onclick = this.action;
    return aHref;
}

function Container(children) {
    BaseUiElement.call(this);
    this.children = children;    
}
Container.prototype = Object.create(BaseUiElement.prototype);
Container.prototype.constructor = Container;
Container.prototype.renderWrapper = function() {
    return document.createElement('div');
}
Container.prototype.render = function() {
    var container = this.renderWrapper();
    this.applyBaseProperties(container);

    this.children.forEach(function(el) {
        if(el instanceof BaseUiElement) {
            container.appendChild(el.render());
        }
    });
    
    return container;
}

function Form(url, method, children) {
    Container.call(this, children);
    this.url = url;
    this.method = method;
}
Form.prototype = Object.create(Container.prototype);
Form.prototype.create = Container;
Form.prototype.renderWrapper = function() {
    var form = document.createElement('form');
    form.action = this.url;
    form.method = this.method;
    return form;
}


function FormRow(label, input) {
    BaseUiElement.call(this);
    this.label = label;
    this.input = input;
}
FormRow.prototype = Object.create(BaseUiElement.prototype);
FormRow.prototype.create = FormRow;
FormRow.prototype.render = function() {
    var container = document.createElement('div');
    this.applyBaseProperties(container);
    container.classList.add('form-row');
    
    var labelCell = document.createElement('div');
    labelCell.classList.add('label-cell');
    labelCell.appendChild(this.label.render());
    container.appendChild(labelCell);

    var inputCell = document.createElement('div');
    inputCell.classList.add('input-cell');
    inputCell.appendChild(this.input.render());
    container.appendChild(inputCell);

    if(this.input.id) {
        this.label.for = this.input.id;
    }

    return container;
}

function Label(text) {
    BaseUiElement.call(this);
    this.text = text;
}
Label.prototype = Object.create(BaseUiElement.prototype);
Label.prototype.create = Label;
Label.prototype.render = function() {
    var label = document.createElement('label');
    label.innerHTML = this.text;
    return label;
}

