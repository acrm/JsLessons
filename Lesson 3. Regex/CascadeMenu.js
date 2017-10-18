// CascadeMenu
function CascadeMenu(items, id, className) {
  BaseUiElement.call(this, id, className);
  this.items = items;
}
CascadeMenu.prototype = Object.create(BaseUiElement.prototype);
CascadeMenu.prototype.constructor = CascadeMenu;
CascadeMenu.prototype.render = function() {
  var ul = document.createElement('ul');
  this.applyBaseProperties(ul);
  ul.classList.add('menu');

  for(var i = 0; i < this.items.length; i++) {
      if(this.items[i] instanceof MenuItem) {
          ul.appendChild(this.items[i].render());
      }
  }

  return ul;
}

// MenuItem
function MenuItem(content) {
  BaseUiElement.call(this);
  this.content = content;
}
MenuItem.prototype = Object.create(BaseUiElement.prototype);
MenuItem.prototype.constructor = CascadeMenu;
MenuItem.prototype.renderContent = function() {
  return this.content.render();
}
MenuItem.prototype.render = function() {
  var li = document.createElement('li');
  this.applyBaseProperties(li);    
  li.classList.add('menu-item');

  li.appendChild(this.renderContent());

  return li;
}

// NestedMenuItem
function NestedMenuItem(caption, items) {
  MenuItem.call(this);
  this.caption = caption; 
  this.submenu = new CascadeMenu(items);  
}
NestedMenuItem.prototype = Object.create(MenuItem.prototype);
NestedMenuItem.prototype.constructor = NestedMenuItem;
NestedMenuItem.prototype.renderContent = function() {
  var p = document.createElement('p');
  p.appendChild(this.caption.render());
  p.appendChild(this.submenu.render());
  return p;
}
