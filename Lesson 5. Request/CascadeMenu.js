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
CafeMenu.prototype.render = function() {
  this.loadTypesData((type, items) => {
    var loadingWrapper = this.loadingWrappers[type];
    loadingWrapper.onComplete(() => {
      var stuffingItems = items.map((stuffing) => {
        var item = new MenuItem(new ActionLink(
          new TextBlock(
            stuffing.name + ' ' + stuffing.price + 'р. ' + stuffing.calories + 'кал.'), 
            () => cafe.chooseStuffing(stuffing)
        ));
        return item;
      });
      var nestedMenuItem = new NestedMenuItem(new TextBlock(type), stuffingItems);
      return nestedMenuItem.render(); 
    });
    loadingWrapper.complete();
  });

  var menuItems = [];
  menuItems.push(new MenuItem(new Link('/', new TextBlock('Главная'))));
  
  this.types.forEach((type) => {
    menuItems.push(this.loadingWrappers[type]);
  });

  menuItems.push(new MenuItem(new ActionLink(new TextBlock('Купить'), function() { 
    this.cafe.checkOut();
  })));
  menuItems.push(new MenuItem(new Link('/about', new TextBlock('О нас'))));
    
  var menu = new CascadeMenu(menuItems);
  return menu.render();
///////////////////////////////////////////////////////////////////////
  // this.types.forEach((type) => {
  //   menuItems.push(loadingWrappers[type]);
  // });

  // new NestedMenuItem(new TextBlock('Гамбургеры'), [
  //   new MenuItem(new ActionLink(new TextBlock('Большой гамбургер'), function() { 
  //       cafe.createHamburger(cafe.menu.BIG_HAMBURGER);
  //   })),
  //   new MenuItem(new ActionLink(new TextBlock('Маленький гамбургер'), function() { 
  //       cafe.createHamburger(cafe.menu.SMALL_HAMBURGER);
  //   })),
  //   stuffingMenu,
  //   toppingMenu
  // ]);

  // self.loadingWrapper.onComplete(function() {
  //     var container = new Container();
  //     self.galleryData.forEach(function(element) {
  //         var preview = new Image(element.thumb);
  //         preview.addClass('preview');
  //         preview.setAttribute('data-product-id', element.productId);
  //         var link = new ActionLink(preview, function() {
  //             var fullImg = new Image(element.full);                
  //             Popup.show(fullImg);
  //         });
  //         container.addChild(link.render());
  //     });
  //     return container.render(); 
  // });  
  
  // return self.loadingWrapper.render();
  // loadMenu(function(menu) {
  //     var stuffingItems = [];
  //     menu.stuffings.forEach(function(stuffing) {
  //         var item = new MenuItem(new ActionLink(
  //             new TextBlock(stuffing.name + ' ' + stuffing.price + 'р. ' + stuffing.calories + 'кал.'), 
  //             function() { 
  //                 cafe.chooseStuffing(stuffing);
  //             }));
  //         stuffingItems.push(item);
  //     });
  // });
  
  // // Menu
  // var stuffingMenu = new NestedMenuItem(new TextBlock('Начинки'), [
  //     new MenuItem(new ActionLink(new TextBlock('Сыр'), function() { 
  //         cafe.chooseStuffing(cafe.menu.CHEESE_STUFFING);
  //     })),
  //     new MenuItem(new ActionLink(new TextBlock('Салат'), function() { 
  //         cafe.chooseStuffing(cafe.menu.SALAD_STUFFING);
  //     })),
  //     new MenuItem(new ActionLink(new TextBlock('Картошка'), function() { 
  //         cafe.chooseStuffing(cafe.menu.SALAD_STUFFING);
  //     })),
  //     premiumStuffingMenu = new NestedMenuItem(new TextBlock('Премиальные начинки'), [
  //         new MenuItem(new ActionLink(new TextBlock('Эти цены меня расстраивают'), function() { 
  //             premiumStuffingMenu.remove();
  //         })).addClass('frustration-item'),    
  //         new MenuItem(new ActionLink(new TextBlock('Трюфеля'), function() { 
  //             cafe.chooseStuffing(cafe.menu.TRUFFLE_STUFFING);
  //         })),
  //         new MenuItem(new ActionLink(new TextBlock('Омары'), function() { 
  //             cafe.chooseStuffing(cafe.menu.LOBSTER_STUFFING);
  //         }))
  //     ]).setId('premium-menu')
  // ]);
  
  // var toppingMenu = new NestedMenuItem(new TextBlock('Топпинги'), [
  //     new MenuItem(new ActionLink(new TextBlock('Добавить специи'), function() { 
  //         cafe.addTopping(cafe.menu.SPICIES_TOPPING);
  //     })),
  //     new MenuItem(new ActionLink(new TextBlock('Убрать специи'), function() { 
  //         cafe.removeTopping(cafe.menu.SPICIES_TOPPING);
  //     })),
  //     new MenuItem(new ActionLink(new TextBlock('Добавить майонез'), function() { 
  //         cafe.addTopping(cafe.menu.MAYONNAISE_TOPPING);
  //     })),
  //     new MenuItem(new ActionLink(new TextBlock('Убрать майонез'), function() { 
  //         cafe.removeTopping(cafe.menu.MAYONNAISE_TOPPING);
  //     }))
  // ]);
  
  // var menu = new CascadeMenu([
  //     new MenuItem(new Link('/', new TextBlock('Главная'))),
  //     new NestedMenuItem(new TextBlock('Гамбургеры'), [
  //         new MenuItem(new ActionLink(new TextBlock('Большой гамбургер'), function() { 
  //             cafe.createHamburger(cafe.menu.BIG_HAMBURGER);
  //         })),
  //         new MenuItem(new ActionLink(new TextBlock('Маленький гамбургер'), function() { 
  //             cafe.createHamburger(cafe.menu.SMALL_HAMBURGER);
  //         })),
  //         stuffingMenu,
  //         toppingMenu
  //     ]),
  //     new MenuItem(new ActionLink(new TextBlock('Купить'), function() { 
  //         cafe.checkOut();
  //     })),
  //     new MenuItem(new Link('/about', new TextBlock('О нас')))
  // ]);
}
