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
function TextField(name, placeholder, validationRule, linesNumber) {
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

    if(this.validationRule) {
        validationWrapper.setAttribute('data-validation-message', this.validationRule.hint)    
        var pattern = this.validationRule.pattern;
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
