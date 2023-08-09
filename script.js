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
let calculator = {
    result: "",
    entry: "",
    operation: "",
    num1: "",
    num2: "",
    operator: "",
    operations: {
        clear: () => {
            calculator.result = ""; //reset result
            calculator.operation = ""; //reset operation
            calculator.num1 = "";
            calculator.num2 = "";
            calculator.operator = "";
            calculator.resizeOutput('0');
            document.getElementById("result").innerText = 0; 
            document.getElementById("operation").innerText = calculator.operation; 
        },
        backspace: () => {
            if(calculator.result.length > 1){
                calculator.result = calculator.result.split('').slice(0, -1).join(''); //remove last entered digit
                calculator.resizeOutput();
                document.getElementById("result").innerText = calculator.formatNumber(calculator.result);
            }else{
                calculator.result = ""; //reset result
                calculator.resizeOutput();
                document.getElementById("result").innerText = 0; 
            }
        },
        add: (a,b) => a + b,
        subtract: (a,b) => a - b,
        divide: (a,b) => a / b,
        multiply: (a,b) => a * b,
    },
    formatOperator(op){
        let operator;
        switch(op){
            case "add":
                operator = "+";
                break;
            case "subtract":
                operator = "&minus;";
                break;
            case "divide":
                operator = "&div;";
                break;
            case "multiply":
                operator = "&times;";
                break;
            case "equals":
                operator = "=";
        }
        return operator;
    },
    calculateNumber(e){
        this.result = this.operations[this.operator](+this.num1, +this.num2).toString();
        document.getElementById("result").innerHTML = this.formatNumber(this.result);
        this.num1 = this.result;
        this.num2 = "";
        this.operator = `${e.target.dataset.op}`
        this.operation = `${this.formatNumber(this.result)} ${this.formatOperator(this.operator)}`
        document.getElementById("operation").innerHTML = this.operation;
    },
    enterNumber(e){
        if(!this.operator && this.num1.length < 15){ 
                this.num1 += "" + e.target.innerText;
                this.outputResult(this.num1);
        } else if(this.operator && this.num2.length < 15){
            this.num2 += "" + e.target.innerText;
            this.outputResult(this.num2);
        } else{
            feedback.animateFeedback(document.getElementById("feedback"));
        }
    },
    enterOperator(e){
        if(this.operator && this.num1 && this.num2) {
            this.calculateNumber(e);
        } else{
            this.operator = `${e.target.dataset.op}`
            this.operation = `${this.formatNumber(this.num1)} ${this.formatOperator(this.operator)}`
            document.getElementById("operation").innerHTML = this.operation;
        }
    },
    outputResult(num){
        if(num.length <= 15){
            document.getElementById("result").innerText = this.formatNumber(num);
        }
        if(num.length >= 12){
            this.resizeOutput(num);
        }
    },
    resizeOutput(num){//resize font size based on how many digits have been entered
        if(num.length >= 12){
            document.getElementById("result").style.fontSize = "var(--fs-600)"
        } else{
            document.getElementById("result").style.fontSize = "var(--fs-700)"
        }
    },
    formatNumber(num){
        return parseInt(num).toLocaleString();
    }

}

//Number Button Functionality
document.querySelectorAll(".btn--num").forEach((btn) => {
    btn.addEventListener("click", (e)=>{
        calculator.enterNumber(e);
    })
})

//Clear Button Functionality
document.getElementById("clear").addEventListener("click", calculator.operations.clear);

//Backspace Button Functionality
document.getElementById("backspace").addEventListener("click", calculator.operations.backspace);

//Operator Button Functionality
document.querySelectorAll(".btn--op").forEach((btn)=>{
    btn.addEventListener("click", (e)=>{
        calculator.enterOperator(e);
    })
})