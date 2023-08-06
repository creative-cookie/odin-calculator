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
        this.resetFeedbackTimer(this.intervalFadeInId);
        this.resetFeedbackTimer(this.timeoutFadeOutId);
        this.resetFeedbackTimer(this.intervalFadeOutId);

        this.fadeInFeedback(msg);
        this.fadeOutFeedback(msg);
    }
}

//Calculator Object
let calculator = {
    total: "",
    operations: {
        clear: () => {
            calculator.total = ""; //reset total
            document.getElementById("total").style.fontSize = "var(--fs-700)"
            document.getElementById("total").innerText = 0; 
        },
    },
    enterNumber(e){
        if(this.total.length < 15){
            this.total += "" + e.target.innerText;
        }else{
            feedback.animateFeedback(document.getElementById("feedback"));
        }
    },
    outputTotal(){
        if(this.total.toString().length <= 15){
            document.getElementById("total").innerText = parseInt(this.total).toLocaleString();
        }
        if(this.total.toString().length >= 12){
            document.getElementById("total").style.fontSize = "var(--fs-600)"
        }
    }

}

//Number Button Functionality
document.querySelectorAll(".btn--num").forEach((btn) => {
    btn.addEventListener("click", (e)=>{
        calculator.enterNumber(e);
        calculator.outputTotal();
})})


//Clear Button Functionality
document.getElementById("clear").addEventListener("click", calculator.operations.clear);

