// Food
function Food(name) {
    this.name = name;
}
Food.prototype.calcPrice = function() {
    return 0;
}
Food.prototype.calcCalories = function() {
    return 0;
}

// SimpleFood
function SimpleFood(name, price, calories) {
    Food.call(this, name);
    this.price = price;
    this.calories = calories;
}
SimpleFood.prototype = Object.create(Food.prototype);
SimpleFood.prototype.constructor = SimpleFood;
SimpleFood.prototype.calcPrice = function() {
    return this.price;
}
SimpleFood.prototype.calcCalories = function() {
    return this.calories;
}

// CompositeFood
function CompositeFood(name, parts) {
    Food.call(this, name);
    this.parts = parts;
}
CompositeFood.prototype = Object.create(Food.prototype);
CompositeFood.prototype.constructor = CompositeFood;
CompositeFood.prototype.calcPrice = function() {
    return this.parts.reduce(function(prevVal, curVal) { return prevVal + curVal.calcPrice();}, 0);
}
CompositeFood.prototype.calcCalories = function() {
    return this.parts.reduce(function(prevVal, curVal) { return prevVal + curVal.calcCalories();}, 0);
}

// Stuffing
function Stuffing(name, price, calories) {
    SimpleFood.call(this, name, price, calories);
}
Stuffing.prototype = Object.create(SimpleFood.prototype);
Stuffing.prototype.constructor = Stuffing;

// Topping
function Topping(name, price, calories) {
    SimpleFood.call(this, name, price, calories);
}
Topping.prototype = Object.create(SimpleFood.prototype);
Topping.prototype.constructor = Topping;

// HamburgerSize
function HamburgerSize(name) {
    this.name = name;
}
HamburgerSize.BIG_SIZE = new HamburgerSize("Большой");
HamburgerSize.SMALL_SIZE = new HamburgerSize("Маленький");    
HamburgerSize.SIZES = [HamburgerSize.BIG_SIZE, HamburgerSize.SMALL_SIZE];        
HamburgerSize.prototype.getName = function() {
    return this.name;
}    

// Hamburger
function Hamburger(name, size, price, calories) {
    var base = new SimpleFood("Основа", price, calories);
    CompositeFood.call(this, name, [base]);
    this.isStuffed = false;
    if(HamburgerSize.SIZES.some(function(s) { return s.getName() === size.getName();})) {
        this.size = size;
    }
    else {
        throw new Exception("Такого размера гамбургеры у нас не делаются.");
    }
}
Hamburger.prototype = Object.create(CompositeFood.prototype);
Hamburger.prototype.constructor = Hamburger;
Hamburger.prototype.chooseStuffing = function(stuffing) {
    if(this.isStuffed) {
        return "Начинка уже была выбрана.";
    }

    if(stuffing instanceof Stuffing) {
        this.parts.push(stuffing);
        this.isStuffed = true;
        return "Начинка выбрана.";  
    }
    else {
        return "Данный продукт нельзя использовать в качестве начинки.";
    }
}
Hamburger.prototype.addTopping = function(topping) {
    if(topping instanceof Topping) {
        if(this.parts.includes(topping)) {
            return "Данный топпинг уже был добавлен.";        
        }
        this.parts.push(topping);
        return "Топпинг добавлен.";  
    }
    else {
        return "Данный продукт нельзя использовать в качестве топпинга.";
    }
}
Hamburger.prototype.removeTopping = function(topping) {
    if(topping instanceof Topping) {
        var index = this.parts.indexOf(topping); 
        if(index == -1) {
            return "Данный топпинг не был добавлен.";        
        }
        this.parts.splice(index, 1);
        return "Топпинг удален.";  
    }
    else {
        return "Данный продукт нельзя использовать в качестве топпинга.";
    }
}
Hamburger.prototype.getName = function() {
    return this.size.getName() + " гамбургер"; 
}
Hamburger.prototype.checkOut = function() {
    if(!this.isStuffed) {
        return "Вы ещё не выбрали начинку.";
    }
    
    return "Вы заказали " 
        + this.getName() + "." 
        + " Ваш заказ стоит " 
        + this.calcPrice() 
        + " рублей и содержит " 
        + this.calcCalories() 
        + " калорий";
} 

function BurgerCafe(address) {
    this.address = address;
    this.yourHamburger = null
}
BurgerCafe.prototype.menu = {
    SMALL_HAMBURGER: new Hamburger('Маленький гамбургер', HamburgerSize.SMALL_SIZE, 50, 20),
    BIG_HAMBURGER: new Hamburger('Большой гамбургер', HamburgerSize.BIG_SIZE, 100, 40),
        
    CHEESE_STUFFING: new Stuffing('Сыр', 10, 20),
    SALAD_STUFFING: new Stuffing('Салат', 20, 5),
    POTATO_STUFFING: new Stuffing('Картошка', 15, 10),
    TRUFFLE_STUFFING: new Stuffing('Трюфели', 200, 20),
    LOBSTER_STUFFING: new Stuffing('Лобстер', 150, 15),
   
    SPICIES_TOPPING: new Topping('Специи', 15, 0),
    MAYONNAISE_TOPPING: new Topping('Майонез', 20, 5)
}
BurgerCafe.prototype.spellAction = function(message) {
    var dialog = document.getElementById('dialog');
    var p = document.createElement('p');
    p.innerHTML = message;
    dialog.appendChild(p);
}
BurgerCafe.prototype.checkHamburger = function() {
    if(this.yourHamburger == null) {
        this.spellAction("Вы не выбрали гамбургер.");   
        return false;
    }
    return true;
}
BurgerCafe.prototype.createHamburger = function(chosenHamburger) {
    if(this.yourHamburger == null) {
        this.yourHamburger = Object.create(chosenHamburger);
        this.spellAction("Вы заказали " + this.yourHamburger.getName() + ".");                            
    }
    else {
        this.spellAction("У вас уже заказан " + this.yourHamburger.getName() + ".");
    }
}
BurgerCafe.prototype.chooseStuffing = function(chosenStuffing) {
    if(!this.checkHamburger()) return;

    this.spellAction(this.yourHamburger.chooseStuffing(chosenStuffing));
}
BurgerCafe.prototype.addTopping = function(chosenTopping) {
    if(!this.checkHamburger()) return;

    this.spellAction(this.yourHamburger.addTopping(chosenTopping));
}
BurgerCafe.prototype.removeTopping = function(chosenTopping) {
    if(!this.checkHamburger()) return;

    this.spellAction(this.yourHamburger.removeTopping(chosenTopping));
}
BurgerCafe.prototype.checkOut = function() {
    if(!this.checkHamburger()) return;
    
    this.spellAction(this.yourHamburger.checkOut());
}

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
      var parent = this.wrapper.parentNode;
      parent.insertBefore(completeContentProvider(), this.wrapper);
      parent.removeChild(this.wrapper);
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
    this.data = {};
}
BaseUiElement.renderSomething = function(something) {
    if(typeof something === 'String') {
        var wrapper = document.createElement('span');
        wrapper.innerHTML = something;
        return wrapper;
    }
    else if(something instanceof BaseUiElement) {
        return something.render();
    }
    else if(something instanceof Node) {
        return something;
    }
    else {
        throw new UiException('Element cannot be rendered');
    }
}
BaseUiElement.prototype.setId = function(id) {
    this.id = id;
    return this;
}
BaseUiElement.prototype.addClass = function(className) {
    this.classList.push(className);
    return this;
}
BaseUiElement.prototype.setData = function(key, value) {
    this.data[key] = value;
}
BaseUiElement.prototype.applyBaseProperties = function(element) {
    if(this.id) {
        element.id = this.id;
    } 
    this.classList.forEach(function(className) {
        element.classList.add(className);
    });
    Object.keys(this.data).forEach((key )=> {
        element.setAttribute('data-' + key, this.data[key]);
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

function Container(children) {
    BaseUiElement.call(this);
    this.children = children ? children : [];
    this.container = null;    
}
Container.prototype = Object.create(BaseUiElement.prototype);
Container.prototype.constructor = Container;
Container.prototype.renderWrapper = function() {
    return document.createElement('div');
}
Container.prototype.render = function() {
    var self = this;
    this.container = this.renderWrapper();
    this.applyBaseProperties(this.container);
    this.children.forEach(function(el) {
        self.container.appendChild(BaseUiElement.renderSomething(el));
    });
    
    return this.container;
}
Container.prototype.addChild = function(child) {
    if(this.container) {
        this.container.appendChild(BaseUiElement.renderSomething(el));
    }
    else {
        this.children.push(child);
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
    this.span = null;
}
TextBlock.prototype = Object.create(BaseUiElement.prototype);
TextBlock.prototype.constructor = TextBlock;
TextBlock.prototype.render = function() {
    var span = document.createElement('span');
    this.applyBaseProperties(span);
    span.innerText = this.text;
    this.span = span;
    return span;
}
TextBlock.prototype.setText = function(text) {
    this.text = text;
    if(this.span) {     
        this.span.innerText = this.text;
    }
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
    
    var close = new ActionLink(new TextBlock('x'), function() { popupOverlay.remove(); });
    close.addClass('popup-close');
    popupOverlay.appendChild(close.render());
    
    document.body.appendChild(popupOverlay);
}

function ShoppingBasketItem(productId, count) {
    BaseUiElement.call(this);
    this.productId = productId;
    this.count = count;
    this.price = null;
    this.name = null;
    this.isLoaded = false;
}
ShoppingBasketItem.prototype = Object.create(BaseUiElement.prototype);
ShoppingBasketItem.prototype.constructor = ShoppingBasketItem;
ShoppingBasketItem.prototype.render = function() {
    var item = document.createElement('li');

    return item;
}

function ShoppingBasketContent() {
    BaseUiElement.call(this);
}
ShoppingBasketContent.prototype = Object.create(BaseUiElement.prototype);
ShoppingBasketContent.prototype.constructor = ShoppingBasketContent;
ShoppingBasketContent.prototype.render = function() {

}

function ShoppingBasketPreview() {
    BaseUiElement.call(this);
}
ShoppingBasketPreview.prototype = Object.create(BaseUiElement.prototype);
ShoppingBasketPreview.prototype.constructor = ShoppingBasketPreview;
ShoppingBasketPreview.prototype.render = function() {
    var totalPrice;
    var container = new Container([
        totalPrice = new TextBlock('0').addClass('price'),
        new ActionLink(new Image('assets/shopping-cart.png'), function () {
            Popup.show(new ActionLink(new TextBlock('Увеличить счётчик'), function () {  
                totalPrice.setText(parseInt(totalPrice.text) + 1);                
            }));            
        })
    ]).addClass('basket-preview');
    return container.render();
}


var validationRules = {
    name: {
        pattern: /[A-Za-zА-Яа-я]+/,
        hint: 'Имя может состоять только из букв латинского или кириллического алфавита'
    },
    phone: {
        pattern: /\+7\(\d{3}\)\d{3}-\d{4}/,
        hint: 'Телефон в формате +7(000)000-0000'
    },
    email: {
        pattern: /\w+[\w\.-]*@\w+[\w\.-]*\.\w{2,}/,
        hint: 'Адрес почты должен быть в виде mymail@mail.ru, или my.mail@mail.ru, или my-mail@mail.ru'
    }
};

/**
 * Класс текстовых полей, поддерживающих валидацию.
 * 
 * @constructor 
 * @param   {String} name Имя поля, уникальное для формы
 * @param   {String} placeholder Поясняющий текст в поле
 * @param   validationRule { pattern: 'валидирующий шаблон', hint: 'подсказка валидации' }
 */ 
function TextField(name, placeholder, linesNumber, validationRule) {
    BaseUiElement.call(this);  
    this.name = name;
    this.placeholder = placeholder;
    this.validationRule = validationRule;
    this.linesNumber = !linesNumber ? 1 : linesNumber; 
}
TextField.prototype = Object.create(BaseUiElement.prototype);
TextField.prototype.constructor = TextField;
TextField.prototype.render = function() {
    var validationWrapper = document.createElement('span');
    validationWrapper.classList.add('validation-wrapper');     
    this.applyBaseProperties(validationWrapper);        
    
    if(this.linesNumber > 1) {
        var input = document.createElement('textarea');
        input.rows = this.linesNumber;    
    }
    else {
        var input = document.createElement('input');
        input.type = 'text';    
    }
    input.name = this.name;
    input.placeholder = this.placeholder;
    validationWrapper.appendChild(input);

    var pattern;
    if(this.validationRule) {
        validationWrapper.setAttribute('data-validation-message', this.validationRule.hint)    
        pattern = this.validationRule.pattern;
    }
    input.addEventListener('input', function(event) {
        if(!pattern) return;
        
        if(this.value.length > 0) {
            if(pattern.test(this.value)) {
                validationWrapper.classList.remove('invalid');
                validationWrapper.classList.add('valid');
            }
            else {
                validationWrapper.classList.add('invalid');
                validationWrapper.classList.remove('valid');
            }
        }
        else {
            validationWrapper.classList.remove('valid');
            validationWrapper.classList.remove('invalid');
        }
    });
    
    return validationWrapper;
}
