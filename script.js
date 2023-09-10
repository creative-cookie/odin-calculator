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
    }

    this.backspace = function(){
        if(this.isResult) return; //prevent backspace on result of operation
        this.currentOperand = this.currentOperand.toString().slice(0,-1);
        if(this.currentOperand === '-' || this.currentOperand == '') this.currentOperand = '0';
    }

    this.changeSign = function(){
        if(this.currentOperand == '0' || this.currentOperand === '' || this.isResult) return;

        if(this.currentOperand.toString()[0] === '-'){
            this.currentOperand = this.currentOperand.toString().slice(1);
        } else{
            this.currentOperand = '-' + this.currentOperand;
        }
    }

    this.convertToPercentage = function(){
        if(this.previousOperand === ''){
            this.currentOperand = parseFloat(this.currentOperand) / 100;
        } else {
            this.currentOperand = (parseFloat(this.currentOperand) / 100) * parseFloat(this.previousOperand);
        }
    }

    this.appendNum = function(num){
        //if currentOperand is 15 digits long, prevent additional digits from being input
        if(this.isMaxLength(this.currentOperand, this.maxInputLength)){
            feedback.animateFeedback(charLimitMsg);
            return;
        }

        if(num === '.' && this.currentOperand.includes('.')) return;
        
        if(this.isResult || this.currentOperand === '0'){ //check if currentOperand is result of operation or 0
            this.currentOperand = num.toString(); //replace currentOperand with new input instead of concatenating onto result or 0
            this.isResult = false;
        } else{
            this.currentOperand += num.toString();
        }

        if(num === '.' && this.currentOperand.split('').indexOf('.') === 0){ //add 0 before decimal if no digits were entered before it
            this.currentOperand = '0.';
        } 
    }

    this.setOperator = function(operator){
        if(this.currentOperand === ''){ // allow for change in operator if currentOperand is not set
            this.operator = operator;
            return;
        }

        if(this.previousOperand !== '') { this.compute() }

        this.operator = operator;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
        this.isResult = false;
    }

    this.compute = function(){
        let result;
        let prev = parseFloat(this.previousOperand);
        let current = parseFloat(this.currentOperand);

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
        if(number.charAt(number.length-1) === '.'){ //remove decimal point if no digit was entered after it
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
        if(this.isMaxLength(this.currentOperand, 12)){
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