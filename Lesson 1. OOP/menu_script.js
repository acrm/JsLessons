// Container
function Container() {
    this.id = '';
    this.className = '';
    this.htmlCode = '';
}
Container.prototype.render = function() {
    return this.htmlCode;
}
Container.prototype.remove = function() {
    if(this.id != '') {
        var container = document.getElementById(this.id);
        if(container != null) {
            container.remove();
        }
        else {
            console.log("Элемент с id=" + this.id + " не добавлен в документ.");                        
        }
    }
    else {
        console.log("Нельзя удалить элемент с отсутствующим id.");
    }
}

// Link
function Link(myHref, container) {
    Container.call(this);
    
    this.container = container;
    this.href = myHref;
}
Link.prototype = Object.create(Container.prototype);
Link.prototype.constructor = Link;
Link.prototype.renderContent = function() {
    return this.container.render();
}
Link.prototype.render = function() {
    var aHref = document.createElement('a');
    aHref.href = this.href;
    aHref.appendChild(this.renderContent());
    
    return aHref;
}

// ActionLink
function ActionLink(action, container) {
    Link.call(this, '#', container);
    
    this.action = action;
}
ActionLink.prototype = Object.create(Link.prototype);
ActionLink.prototype.constructor = ActionLink;
ActionLink.prototype.baseRender = Link.prototype.render
ActionLink.prototype.render = function() {
    var aHref = this.baseRender();
    aHref.onclick = action;
    return aHref;
}

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

// TextLink
function TextLink(href, label) {
    Link.call(this, href, new Label(label));
}
TextLink.prototype = Object.create(Link.prototype);
TextLink.prototype.constructor = TextLink;


// Menu
function Menu(myId, myClass, myItems) {
    Container.call(this);
    this.id = myId;
    this.className = myClass;
    this.items = myItems;
}
Menu.prototype = Object.create(Container.prototype);
Menu.prototype.constructor = Menu;
Menu.prototype.render = function() {
    var ul = document.createElement('ul');
    ul.className = this.className;
    ul.id = this.id;

    for(var i = 0; i < this.items.length; i++) {
        if(this.items[i] instanceof MenuItem) {
            ul.appendChild(this.items[i].render());
        }
    }

    return ul;
}

// MenuItem
function MenuItem() {
    Container.call(this);
    this.className = 'menu-item';
}
MenuItem.prototype = Object.create(Container.prototype);
MenuItem.prototype.constructor = Menu;
MenuItem.prototype.renderContent = function() {
    return "Empty element";
}
MenuItem.prototype.render = function() {
    var li = document.createElement('li');
    li.className = this.className;
    li.id = this.id;

    li.appendChild(this.renderContent());

    return li;
}

// LinkMenuItem
function LinkMenuItem(href, label) {
    MenuItem.call(this);
    this.link = new TextLink(href, label)    
}
LinkMenuItem.prototype = Object.create(MenuItem.prototype);
LinkMenuItem.prototype.constructor = LinkMenuItem;
LinkMenuItem.prototype.renderContent = function() {
    return this.link.render();
}

// ActionLinkMenuItem
function ActionLinkMenuItem(label, action) {
    MenuItem.call(this);
    this.link = new ActionLink(action, label)    
}
LinkMenuItem.prototype = Object.create(MenuItem.prototype);
LinkMenuItem.prototype.constructor = LinkMenuItem;
LinkMenuItem.prototype.renderContent = function() {
    return this.link.render();
}

// NestedMenuItem
function NestedMenuItem(label, id, className, items) {
    MenuItem.call(this);
    this.id = id;  
    this.label = new Label(label); 
    this.submenu = new Menu('', className, items);  
}
NestedMenuItem.prototype = Object.create(MenuItem.prototype);
NestedMenuItem.prototype.constructor = NestedMenuItem;
NestedMenuItem.prototype.renderContent = function() {
    var p = document.createElement('p');
    p.appendChild(this.label.render());
    p.appendChild(this.submenu.render());
    return p;
}