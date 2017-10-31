// CascadeMenu
function CascadeMenu(items, id, className) {
  BaseUiElement.call(this);
  this.setId(id);
  this.addClass(className);
  this.items = items;
}
CascadeMenu.prototype = Object.create(BaseUiElement.prototype);
CascadeMenu.prototype.constructor = CascadeMenu;
CascadeMenu.prototype.render = function() {
  var ul = document.createElement('ul');
  this.applyBaseProperties(ul);
  ul.classList.add('menu');

  for(var i = 0; i < this.items.length; i++) {
      //if(this.items[i] instanceof MenuItem) {
          ul.appendChild(this.items[i].render());
      //}
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

function CafeMenu(cafe, productsUrl) {
  BaseUiElement.call(this);
  this.cafe = cafe;
  this.productsUrl = productsUrl;
  this.types = ['hamburger', 'stuffing', 'topping'];
  this.loadingWrappers = {};
  this.types.forEach((type) =>  this.loadingWrappers[type] = new LoadingWrapper(new MenuItem(new TextBlock('Loading menu'))));
}
CafeMenu.prototype = Object.create(BaseUiElement.prototype);
CafeMenu.prototype.constructor = CafeMenu;
CafeMenu.prototype.loadTypesData = function(onTypeLoaded) {
  this.types.forEach((type) => {
    Http.get(this.productsUrl + '/?type=' + type, (err, data) => {
      if(err) throw new Error(err);
      
      var items = data.map((productData) => this.createProduct(productData));
      onTypeLoaded(type, items);      
    });
  });    
}
CafeMenu.prototype.createProduct = function(data) {
  switch(data.type) {
      case 'hamburger':
          var size = new HamburgerSize(data.properties.size);
          return new Hamburger(data.name, size, data.price, data.calories);
      case 'stuffing':
          return new Stuffing(data.name, data.price, data.calories);             
      case 'topping':
          return new Topping(data.name, data.price, data.calories);
  }
}
CafeMenu.prototype.renderHamburgerMenu = function(items) {
  var hamburgerItems = items.map((hamburger) => {
    var item = new MenuItem(new ActionLink(
      new TextBlock(
        hamburger.getName() + ' ' + hamburger.calcPrice() + ' р. ' + hamburger.calcCalories() + ' кал.'), 
        () => this.cafe.createHamburger(Object.create(hamburger))
    ));
    return item;
  });
  var nestedMenuItem = new NestedMenuItem(new TextBlock('Гамбургеры'), hamburgerItems);
  return nestedMenuItem.render(); 
}
CafeMenu.prototype.renderStuffingMenu = function(items) {
  var regularStuffingItems = [];
  var premiumStuffingItems = [];
  items.forEach((stuffing) => {
    var item = new MenuItem(new ActionLink(
      new TextBlock(
        stuffing.name + ' ' + stuffing.price + ' р. ' + stuffing.calories + ' кал.'), 
        () => this.cafe.chooseStuffing(stuffing)
    ));
    
    if(stuffing.price > 100) {
      premiumStuffingItems.push(item);
    }
    else {
      regularStuffingItems.push(item);
    }
  });
  
  var stuffingItems;
  if(regularStuffingItems.length > 0) {
    stuffingItems = regularStuffingItems;
    if(premiumStuffingItems.length > 0) {
      var premiumStuffingMenu = new NestedMenuItem(
        new TextBlock('Премиальные начинки'), 
        [
          new MenuItem(new ActionLink(
            new TextBlock('У меня нет столько денег'),
            () => { premiumStuffingMenu.remove(); })
          ).addClass('frustration-item'), 
        ].concat(premiumStuffingItems)
      ).setId('premium-menu');
      stuffingItems.push(premiumStuffingMenu);
    }
  }
  else {
    stuffingItems = premiumStuffingItems;
  }
  var nestedMenuItem = new NestedMenuItem(new TextBlock('Начинки'), stuffingItems);
  return nestedMenuItem.render(); 
}
CafeMenu.prototype.renderToppingMenu = function(items) {
  var toppingItems = items.map((topping) => {
    var item = new MenuItem(new Container([
      new TextBlock(topping.name + ' ' + topping.price + ' р. ' + topping.calories + ' кал.'),
      new ActionLink(new TextBlock('+'), () => this.cafe.addTopping(topping)).addClass('menu-item-button'),
      new ActionLink(new TextBlock('-'), () => this.cafe.removeTopping(topping)).addClass('menu-item-button')
    ]).addClass('menu-item-container'));
    
    return item;
  });
  var nestedMenuItem = new NestedMenuItem(new TextBlock('Топпинги'), toppingItems);
  return nestedMenuItem.render(); 
}
CafeMenu.prototype.render = function() {
  this.loadTypesData((type, items) => {
    var loadingWrapper = this.loadingWrappers[type];
    loadingWrapper.onComplete(() => {
      switch(type) {
        case 'hamburger': return this.renderHamburgerMenu(items);
        case 'stuffing': return this.renderStuffingMenu(items);         
        case 'topping': return this.renderToppingMenu(items);
      }
    });
    loadingWrapper.complete();
  });

  var menuItems = [];
  menuItems.push(new MenuItem(new TextBlock('Меню:')));
  
  this.types.forEach((type) => {
    menuItems.push(this.loadingWrappers[type]);
  });

  menuItems.push(new NestedMenuItem(new TextBlock('Купить'), [
    new MenuItem(new ActionLink(new TextBlock('Съем сейчас'), () => { this.cafe.checkOut(); })),
    new MenuItem(new ActionLink(new TextBlock('Положить в корзину'), () => { this.cafe.checkOut(); }))
  ]));
    
  var menu = new CascadeMenu(menuItems);
  return menu.render();
}
