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


// Hamburger
function Hamburger(size, price, calories) {
    var base = new SimpleFood(price, calories);
    CompositeFood.call(this, [base]);
    this.isStuffed = false;
    if(SIZES.includes(size)) {
        this.size = size;
    }
    else {
        console.log("Такого размера гамбургеры у нас не делаются.");
    }
}
Hamburger.prototype = Object.create(CompositeFood.prototype);
Hamburger.prototype.constructor = Hamburger;
Hamburger.prototype.BIG_SIZE = "Большой";
Hamburger.prototype.SMALL_SIZE = "Маленький";    
Hamburger.prototype.SIZES = [Hamburger.prototype.BIG_SIZE, Hamburger.prototype.SMALL_SIZE];    
Hamburger.prototype.chooseStuffing = function(stuffing) {
    if(this.isStuffed) {
        console.log("Начинка уже выбрана.");
        return;
    }

    if(stuffing instanceof Stuffing) {
        this.parts.push(stuffing);
        this.isStuffed = true;
    }
    else {
        console.log("Данный продукт нельзя использовать в качестве начинки.");
    }
}
Hamburger.prototype.addTopping = function(topping) {
    if(topping instanceof Topping) {
        if(this.parts.includes(topping)) {
            console.log("Данный топпинг уже добавлен.");
            return;        
        }
        this.parts.push(topping);
    }
    else {
        console.log("Данный продукт нельзя использовать в качестве топпинга.");
    }
}
Hamburger.prototype.removeTopping = function(topping) {
    if(topping instanceof Topping) {
        var index = this.parts.indexOf(topping); 
        if(index == -1) {
            console.log("Данный топпинг не был добавлен.");
            return;        
        }
        this.parts.splice(index, 1);
    }
    else {
        console.log("Данный продукт нельзя использовать в качестве топпинга.");
    }
}
Hamburger.prototype.getName = function() {
    return this.size + " гамбургер"; 
}
Hamburger.prototype.checkOut = function() {
    if(!this.isStuffed) {
        console.log("Ещё не выбрана начинка!");
        return;
    }
    
    return "Вы заказали " 
        + this.getName() + "." 
        + " Ваш заказ стоит " 
        + this.calcPrice() 
        + " рублей и содержит " 
        + this.calcCalories() 
        + " калорий";
} 



var chees = new Stuffing(10, 20);
var salad = new Stuffing(20, 5);
var potatoes = new Stuffing(15, 10);

var spicies = new Topping(15, 0);
var mayonnaise = new Topping(20, 5);

var yourHamburger = Object.create(smallHamburger);
yourHamburger.chooseStuffing(salad);
yourHamburger.addTopping(spicies);
yourHamburger.addTopping(mayonnaise);

yourHamburger.checkOut();

var cafe = {
    SMALL_HAMBURGER: new Hamburger(Hamburger.SMALL_SIZE, 50, 20),
    BIG_HAMBURGER: new Hamburger(Hamburger.BIG_SIZE, 100, 40),
    yourHamburger: null,
    chooseBigHamburger: function() {
        this.createHamburger(this.BIG_HAMBURGER);
    },
    chooseSmallHamburger: function() {
        this.createHamburger(this.SMALL_HAMBURGER);
    },
    createHamburger: function(chosenHamburger) {
        if(this.yourHamburger == null) {
            this.yourHamburger = Object.create(chosenHamburger);
        }
        else {
            console.log("Вы уже заказали " + this.yourHamburger.getName() + ".");
        }
    },
    checkOut: function() {
        return this.yourHamburger != null
            ? this.yourHamburger.checkOut()
            : "Вы не выбрали гамбургер.";
    }
};
