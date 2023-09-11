//Global Variables, DOM Elements
const numBtns = document.querySelectorAll("[data-num]");
const opBtns = document.querySelectorAll("[data-op]");
const clearBtn = document.querySelector("[data-clear]");
const backspaceBtn = document.querySelector("[data-backspace]");
const percentBtn = document.querySelector("[data-percent]");
const signChangeBtn = document.querySelector("[data-sign-change]");
const equalsBtn = document.querySelector("[data-equals]");
const previousValTxtEl = document.querySelector("[data-previous-value]");
const currentValTxtEl = document.querySelector("[data-current-value]");
const charLimitMsg = document.getElementById("feedback");

// Dark Mode Functionality
document.getElementById("theme-icon").addEventListener("click", toggleTheme);

function toggleTheme(){
    document.body.classList.contains("darkmode") ? document.body.classList.remove("darkmode") : document.body.classList.add("darkmode");
    document.getElementById("moon").classList.toggle("hidden");
    document.getElementById("sun").classList.toggle("hidden");
}

//Fade In/Out Feedback Message
const feedback = {
    opacity: 0,
    resetFeedbackTimer(timer){ //reset feedback fade in/out timers
        if(timer){
            clearInterval(timer);
            delete timer;
        }
    },
    fadeInFeedback(msg){
        msg.style.display = "block";
        this.intervalFadeInId = setInterval(() =>{
            if(this.opacity < 1){
                this.opacity += 0.1;
                msg.style.opacity = this.opacity;
            }
        },50)
    },
    fadeOutFeedback(msg){
        this.timeoutFadeOutId = setTimeout(() => {
            clearInterval(this.intervalFadeInId);
            this.intervalFadeOutId = setInterval(() =>{
                if(this.opacity > 0){
                    this.opacity -= 0.1;
                    msg.style.opacity = this.opacity;
                }
                if(this.opacity <= 0){
                    msg.style.display = "none"; //remove from display after fade out
                    clearInterval(this.timeoutFadeOutId);
                }
            },50)
        },2500)
    },
    animateFeedback(msg){ // animate the message fading in then out after 2.5 second delay
        //reset timers each time function is called
        this.resetFeedbackTimer(this.intervalFadeInId);
        this.resetFeedbackTimer(this.timeoutFadeOutId);
        this.resetFeedbackTimer(this.intervalFadeOutId);

        this.fadeInFeedback(msg);
        this.fadeOutFeedback(msg);
    }
}

//Calculator Object
function Calculator(previousValTxtEl, currentValTxtEl){
    this.previousValTxtEl = previousValTxtEl;
    this.currentValTxtEl = currentValTxtEl;
    this.maxInputLength = 15;
    this.maxOutputLength = 18;
    
    this.clear = function(){
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operator = undefined;
        this.isDividedByZero = false;
        this.isResult = false;
        this.enableBtns();
    }

    this.backspace = function(){
        if(this.isDividedByZero) this.clear();
        if(this.isResult) return; //prevent backspace on result of operation
        this.currentOperand = this.currentOperand.toString().slice(0,-1);
        if(this.currentOperand === '-' || this.currentOperand == '') this.currentOperand = '0';
    }

    this.changeSign = function(){
        if(this.isDividedByZero) return;
        if(this.currentOperand == '0' || this.currentOperand === '' || this.isResult) return;

        if(this.currentOperand.toString()[0] === '-'){
            this.currentOperand = this.currentOperand.toString().slice(1);
        } else{
            this.currentOperand = '-' + this.currentOperand;
        }
    }

    this.convertToPercentage = function(){
        if(this.isResult) return;
        if(this.previousOperand === ''){
            this.currentOperand = parseFloat(this.currentOperand) / 100;
        } else {
            this.currentOperand = (parseFloat(this.currentOperand) / 100) * parseFloat(this.previousOperand);
        }
    }

    this.appendNum = function(num){
        if(this.isDividedByZero) this.clear();

        //if currentOperand is 15 digits long and not the result of an operation, prevent additional digits from being input
        if(this.isMaxLength(this.currentOperand, this.maxInputLength) && !this.isResult){
            feedback.animateFeedback(charLimitMsg);
            return;
        }
        
        if(this.isResult || this.currentOperand === '0'){ //check if currentOperand is result of operation or 0
            this.currentOperand = num.toString(); //replace currentOperand with new input instead of concatenating onto result or 0
            this.isResult = false;
        } else if(num === '.' && this.currentOperand.toString().includes('.')){
            return;
        } else{
            this.currentOperand += num.toString();
        }

        if(num === '.' && this.currentOperand.toString().split('').indexOf('.') === 0){ //add 0 before decimal if no digits were entered before it
            this.currentOperand = '0.';
        } 
    }

    this.setOperator = function(operator){
        if(this.isResult && this.previousOperand){ // allow for change in operator if currentOperand is not set
            this.operator = operator;
            return;
        }

        if(this.previousOperand !== '') { this.compute() }

        this.operator = operator;
        this.previousOperand = this.currentOperand;
        this.isResult = true;
    }

    this.compute = function(){
        if(this.isDividedByZero) this.clear();

        if(this.currentOperand == '0' && this.operator === '÷'){
            this.isDividedByZero = true;
            return;
        }

        let result;
        let prev = parseFloat(this.previousOperand);
        let current = parseFloat(this.currentOperand) || parseFloat(this.previousOperand);

        if(isNaN(prev) || isNaN(current)) return

        switch(this.operator){
            case '+':
                result = prev + current;
                break;
            case '−':
                result = prev - current;
                break;
            case '×':
                result = prev * current;
                break;
            case '÷':
                result = prev / current;
                break; 
            default:
                return;
        }

        this.previousOperand = '';
        this.operator = undefined;
        this.currentOperand = parseFloat(result.toPrecision(15));
        this.isResult = true;
    }

    this.removeDecimal = function(number){
        if(number.charAt(number.length - 1) === '.'){
            return number.slice(0,-1);
        } else{
            return number;
        }
    }

    this.formatOperand = function(number){
        if(this.isMaxLength(number, this.maxOutputLength)) return parseFloat(number).toExponential(5);

        const stringNum = number.toString();
        const intNum = parseInt(stringNum.split('.')[0]);
        const decimalNum = stringNum.split('.')[1];
        let intDisplayNum;

        if(isNaN(intNum)){
            intDisplayNum = '';
        } else{
            intDisplayNum = intNum.toLocaleString('en');
        }

        if(decimalNum != null){
            return `${intDisplayNum}.${decimalNum}`;
        } else{
            return intDisplayNum;
        }
    }

    this.updateDisplay = function(){
        if(this.isDividedByZero){
            this.currentValTxtEl.innerText = 'Cannot divide by zero';
            this.currentValTxtEl.style.fontSize = "var(--fs-600)";
            this.disableBtns();
            return;
        } 
        this.resizeDisplay();
        this.currentValTxtEl.innerText = this.formatOperand(this.currentOperand);
        if(this.operator != undefined){
            this.previousValTxtEl.innerText = 
                `${this.removeDecimal(this.formatOperand(this.previousOperand))} ${this.operator}`; 
        }else{
            this.previousValTxtEl.innerText = '';
        }
    }

    this.resizeDisplay = function(){//resize font size based on how many digits have been entered
        if(this.isMaxLength(this.currentOperand || this.previousOperand, 12)){
            this.currentValTxtEl.style.fontSize = "var(--fs-600)"
        } else{
           this.currentValTxtEl.style.fontSize = "var(--fs-700)"
        }
    }

    this.isMaxLength = function(number, maxLength){
        //don't take decimal or sign into account
        let digits = number.toString()
                    .replace('-', '')
                    .replace('.', '')
                    .length; 

        return (digits >= maxLength) ? true : false;
    }

    this.disableBtns = function(){
        opBtns.forEach((btn) => {
            btn.disabled = true;
        })
        percentBtn.disabled = true;
        signChangeBtn.disabled = true;
    }

    this.enableBtns = function(){
        opBtns.forEach((btn) => {
            btn.disabled = false;
        })
        percentBtn.disabled = false;
        signChangeBtn.disabled = false;
    }

    this.clear();
}

//Create New Calculator Object
const calculator = new Calculator(previousValTxtEl, currentValTxtEl);

//Number Button Functionality
numBtns.forEach((btn) => {
    btn.addEventListener("click", ()=>{
        calculator.appendNum(btn.innerText);
        calculator.updateDisplay();
    })
})

opBtns.forEach((btn) => {
    btn.addEventListener("click", ()=>{
        calculator.setOperator(btn.innerText);
        calculator.updateDisplay();
    })
})

percentBtn.addEventListener('click', () =>{
    calculator.convertToPercentage();
    calculator.updateDisplay();
})

equalsBtn.addEventListener('click', () =>{
    calculator.compute();
    calculator.updateDisplay();
})

clearBtn.addEventListener('click', () =>{
    calculator.clear();
    calculator.updateDisplay();
})

backspaceBtn.addEventListener('click', () =>{
    calculator.backspace();
    calculator.updateDisplay();
})

signChangeBtn.addEventListener('click', ()=>{
    calculator.changeSign();
    calculator.updateDisplay();
})

//Keyboard Support
document.addEventListener('keydown', (e) =>{
    const operators = {'/': '÷', '*': '×', '-': '−', '+': '+'}

    switch (true){
        case (!isNaN(e.key)):
        case (e.key === '.'):
            e.preventDefault();
            calculator.appendNum(e.key);
            break;
        case (operators.hasOwnProperty(e.key)):
            e.preventDefault();
            calculator.setOperator(operators[e.key]);
            break;
        case (e.key === 'Enter'):
        case (e.key === '='):
            e.preventDefault();
            calculator.compute();
            break;
        case (e.key === 'Backspace'):
            e.preventDefault();
            calculator.backspace();
            break;
        case (e.key === 'Escape'):
        case (e.key === 'Delete'):
            e.preventDefault();
            calculator.clear();
            break;
        case (e.key === '%'):
            e.preventDefault();
            calculator.convertToPercentage();
            break;
        case (e.key === 'F9'):
            e.preventDefault();
            calculator.changeSign();
            break;
        default:
            break;
    }

    calculator.updateDisplay();
})