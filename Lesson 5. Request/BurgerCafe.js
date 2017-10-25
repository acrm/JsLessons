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
    CompositeFood.call(this, [base]);
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
