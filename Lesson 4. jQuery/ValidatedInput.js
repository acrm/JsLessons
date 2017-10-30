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
    this.inputElement = null;
    this.textBuffer = null;
}
TextField.prototype = Object.create(BaseUiElement.prototype);
TextField.prototype.constructor = TextField;
TextField.prototype.setText = function(text) {
    if(this.inputElement) {
        this.inputElement.value = text;
    }
    else {
        this.textBuffer = text;
    }

    return this;
}
TextField.prototype.getText = function() {
    if(this.inputElement) {
        return this.inputElement.value;
    }
    else {
        return this.textBuffer;
    }
}
TextField.prototype.render = function() {
    var validationWrapper = document.createElement('span');
    validationWrapper.classList.add('validation-wrapper');     
    this.applyBaseProperties(validationWrapper);        
    
    if(this.linesNumber > 1) {
        this.inputElement = document.createElement('textarea');
        this.inputElement.rows = this.linesNumber; 
    }
    else {
        this.inputElement = document.createElement('input');
        this.inputElement.type = 'text';    
    }
    if(this.textBuffer) {
        this.inputElement.value = this.textBuffer;
    }   
    this.inputElement.name = this.name;
    this.inputElement.placeholder = this.placeholder;
    validationWrapper.appendChild(this.inputElement);

    var pattern;
    if(this.validationRule) {
        validationWrapper.setAttribute('data-validation-message', this.validationRule.hint)    
        pattern = this.validationRule.pattern;
    }
    this.inputElement.addEventListener('input', function(event) {
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
