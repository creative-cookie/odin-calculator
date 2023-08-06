// Dark Mode Functionality
document.getElementById("theme-icon").addEventListener("click", toggleTheme);

function toggleTheme(){
    document.body.classList.contains("darkmode") ? document.body.classList.remove("darkmode") : document.body.classList.add("darkmode");
    document.getElementById("moon").classList.toggle("hidden");
    document.getElementById("sun").classList.toggle("hidden");
}

//Fade In/Out Feedback Message
const feedbackDetails = {
    opacity: 0,
}

//reset feedback fade in/out timers
function resetFeedbackTimer(timer){
    if(timer){
        clearInterval(timer);
        delete timer;
    }
}

function fadeFeedback(msg){
    //Reset timers
    resetFeedbackTimer(feedbackDetails.intervalFadeInId);
    resetFeedbackTimer(feedbackDetails.timeoutFadeOutId);
    resetFeedbackTimer(feedbackDetails.intervalFadeOutId);

    //Fade In
    feedbackDetails.intervalFadeInId = setInterval(() =>{
        if(feedbackDetails.opacity < 1){
            feedbackDetails.opacity += 0.1;
            msg.style.opacity = feedbackDetails.opacity;
        }
    },50)

    //Leave message up for 2.5 seconds then fade out
    feedbackDetails.timeoutFadeOutId = setTimeout(() => {
        clearInterval(feedbackDetails.intervalFadeInId);
        feedbackDetails.intervalFadeOutId = setInterval(() =>{
            if(feedbackDetails.opacity > 0){
                feedbackDetails.opacity -= 0.1;
                msg.style.opacity = feedbackDetails.opacity;
            }
        },50)
    },2500)
}

//Calculator Object
let calculator = {
    total: "",
    enterNumber(e){
        if(this.total.length < 15){
            this.total += "" + e.target.innerText;
        }else{
            fadeFeedback(document.getElementById("feedback"));
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


