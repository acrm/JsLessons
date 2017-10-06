// Food
function Food() {
}
Food.prototype.calcPrice = function() {
    return 0;
}
Food.prototype.calcCalories = function() {
    return 0;
}

// SimpleFood
function SimpleFood(price, calories) {
    Food.call(this);
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
function CompositeFood(parts) {
    Food.call(this);
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
function Stuffing(price, calories) {
    SimpleFood.call(this, price, calories);
}
Stuffing.prototype = Object.create(SimpleFood.prototype);
Stuffing.prototype.constructor = Stuffing;

// Topping
function Topping(price, calories) {
    SimpleFood.call(this, price, calories);
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
function Hamburger(size, price, calories) {
    var base = new SimpleFood(price, calories);
    CompositeFood.call(this, [base]);
    this.isStuffed = false;
    if(HamburgerSize.SIZES.includes(size)) {
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
