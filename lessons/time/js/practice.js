const hourInput = document.getElementById("hour-input")
const minuteInput = document.getElementById('minute-input')
const incBtns = document.querySelectorAll(".inc-btn")

incBtns.forEach(btn => {
    handleTimeMechanics(btn, hourInput, minuteInput)
});




