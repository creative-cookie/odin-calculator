const body = document.querySelector("body");
const themeIcon = document.getElementById("theme-icon");

themeIcon.addEventListener("click", toggleTheme);

function toggleTheme(){
    body.classList.contains("darkmode") ? body.classList.remove("darkmode") : body.classList.add("darkmode");
    document.getElementById("moon").classList.toggle("hidden");
    document.getElementById("sun").classList.toggle("hidden");
}