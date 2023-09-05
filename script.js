//Global Variables, DOM Elements
const numBtns = document.querySelectorAll("[data-num");
const opBtns = document.querySelectorAll("[data-op]");
const clearBtn = document.querySelector("[data-clear]");
const backspaceBtn = document.querySelector("[data-backspace]");
const percentBtn = document.querySelector("[data-percent]");
const negateBtn = document.querySelector("[data-negate]");
const equalsBtn = document.querySelector("[data-equals]");
const previousValTxtEl = document.querySelector("[data-previous-value");
const currentValTxtEl = document.querySelector("[data-current-value");

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
    
    this.clear = function(){
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operator = undefined;
    }

    this.backspace = function(){
        this.currentOperand = this.currentOperand.toString().slice(0,-1);
    }

    this.appendNum = function(num){
        if(num === '.' && this.currentOperand.includes('.')) return;
        this.currentOperand += num.toString();
    }

    this.setOperator = function(operator){
        if(this.currentOperand === '') return
        if(this.previousOperand !== '') { this.compute() }

        this.operator = operator;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
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
        this.currentOperand = result;
    }

    this.formatPrevOperand = function(number){
        const stringNum = number.toString();
        const intNum = parseFloat(stringNum.split('.')[0]).toLocaleString('en');
        const decimalNum = stringNum.split('.')[1];

        if(decimalNum){
            return `${intNum}.${decimalNum}`; 
        } else{
            return intNum;
        }
    }

    this.formatCurrentOperand = function(number){
        const stringNum = number.toString();
        const intNum = parseFloat(stringNum.split('.')[0]);
        const decimalNum = stringNum.split('.')[1];
        let intDisplayNum;
        
        if(isNaN(intNum)){
            intDisplayNum = '';
        } else{
            intDisplayNum = intNum.toLocaleString('en', {maximumFractionDigits: 0})
        }
        
        if(decimalNum != null){
            return `${intDisplayNum}.${decimalNum}`;
        } else{
            return intDisplayNum;
        }
    }

    this.updateDisplay = function(){
        this.currentValTxtEl.innerText = this.formatCurrentOperand(this.currentOperand);
        if(this.operator != undefined){
            this.previousValTxtEl.innerText = 
            `${this.formatPrevOperand(this.previousOperand)} ${this.operator}`; 
        }else{
            this.previousValTxtEl.innerText = '';
        }
    }

    this.clear();

    // enterNumber(e){
    //     if(!this.operator && this.num1.length < 15){ 
    //             this.num1 += "" + e.target.innerText;
    //             this.outputResult(this.num1);
    //     } else if(this.operator && this.num2.length < 15){
    //         this.num2 += "" + e.target.innerText;
    //         this.outputResult(this.num2);
    //     } else{
    //         feedback.animateFeedback(document.getElementById("feedback"));
    //     }
    // },
    // outputResult(num){
    //     if(num.length <= 15){
    //         document.getElementById("result").innerText = this.formatNumber(num);
    //     }
    //     if(num.length >= 12){
    //         this.resizeOutput(num);
    //     }
    // },
    // resizeOutput(num){//resize font size based on how many digits have been entered
    //     if(num.length >= 12){
    //         document.getElementById("result").style.fontSize = "var(--fs-600)"
    //     } else{
    //         document.getElementById("result").style.fontSize = "var(--fs-700)"
    //     }
    // },
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