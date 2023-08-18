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
        this.currentOperand = '';
        this.previousOperand = '';
        this.operator = undefined;
    }

    this.backspace = function(){

    }

    this.appendNum = function(num){
        if(num === '.' && this.currentOperand.includes('.')) return;
        this.currentOperand += num.toString();
    }

    this.setOperator = function(operator){

    }

    this.compute = function(){

    }

    this.updateDisplay = function(){
        this.currentValTxtEl.innerText = this.currentOperand;
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
    // enterOperator(e){
    //     if(this.operator && this.num1 && this.num2) {
    //         this.calculateNumber(e);
    //     } else{
    //         this.operator = `${e.target.dataset.op}`
    //         this.operation = `${this.formatNumber(this.num1)} ${this.formatOperator(this.operator)}`
    //         document.getElementById("operation").innerHTML = this.operation;
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
    // formatNumber(num){
    //     return parseInt(num).toLocaleString();
    // }

}

//Create New Calculator Object
const calculator = new Calculator(previousValTxtEl, currentValTxtEl);

//Number Button Functionality
numBtns.forEach((btn) => {
    btn.addEventListener("click", (e)=>{
        calculator.appendNum(btn.innerText);
        calculator.updateDisplay()
    })
})

// //Clear Button Functionality
// document.getElementById("clear").addEventListener("click", calculator.operations.clear);

// //Backspace Button Functionality
// document.getElementById("backspace").addEventListener("click", calculator.operations.backspace);

// //Operator Button Functionality
// document.querySelectorAll(".btn--op").forEach((btn)=>{
//     btn.addEventListener("click", (e)=>{
//         calculator.enterOperator(e);
//     })
// })