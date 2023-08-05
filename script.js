// Dark Mode Functionality
document.getElementById("theme-icon").addEventListener("click", toggleTheme);

function toggleTheme(){
    document.body.classList.contains("darkmode") ? document.body.classList.remove("darkmode") : document.body.classList.add("darkmode");
    document.getElementById("moon").classList.toggle("hidden");
    document.getElementById("sun").classList.toggle("hidden");
}

//Calculator Object
let calculator = {
    total: "",
    enterNumber(e){
        this.total += "" + e.target.innerText;
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


