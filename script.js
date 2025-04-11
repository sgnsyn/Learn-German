const SECONDS = 1000
const timeP = document.querySelector(".time-card .card-img")

function getCurrentTimeFormatted() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds()
    return [`${hours}:${minutes}`,seconds]

}

function init(){
    const [time, seconds] = getCurrentTimeFormatted()
    timeP.textContent = time 
    return 60-seconds
}

updateTimer= init()

setTimeout( ()=>{
    init()
    setInterval(init, 60*SECONDS)
} ,updateTimer * SECONDS) 

