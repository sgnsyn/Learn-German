const hourInput = document.getElementById("hour-input")
const minuteInput = document.getElementById('minute-input')
const incBtns = document.querySelectorAll(".inc-btn")

incBtns.forEach(btn => {
    handleTimeMechanics(btn, hourInput, minuteInput)
});

setInterval(()=>{
    let time = `${hourInput.textContent}:${minuteInput.textContent}`
    console.log(time)
}, 1000)



