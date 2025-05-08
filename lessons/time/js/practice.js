import { getRandomTime,  getOfficialTime, is24HourFormat} from "./time-function.js";
import { evaluateTimeAnswer, compareStringsAndHighlight } from "./time-correction.js";


const timeDisplayElt = document.getElementById("practice-time")
const resetBtn = document.getElementById("reset-btn")
const answerInp = document.getElementById("answer-input")
const correctionEl = document.getElementById("correction-p")
const modeRadios = document.getElementsByName("mode-radio")

let currentTimeStr = ""
let currentTime = ""

function init(){
    loadRadioMode()
    resetTime()
}

function resetTime(){
    const mode = getMode()
    const randomTime = getRandomTime(mode)
    const randomTimeStr = getOfficialTime( randomTime) 

    currentTime = randomTime
    currentTimeStr = randomTimeStr

    timeDisplayElt.textContent = randomTime
    answerInp.style.width = `${randomTimeStr.length + 2 +(Math.floor(Math.random() * 3) + 1)}ch` 
    answerInp.value = ""
    correctionEl.textContent= ""
    removeError(answerInp)

    answerInp.focus()
}


function handleAnsInput(event){
    const userValue = event.target.value 
    const correctValue = currentTimeStr
    const correctness = evaluateTimeAnswer(userValue, correctValue);

    switch (correctness){
        case "A":
            removeError(answerInp)
            answerInp.classList.add("error-msg", "error-green")
            break;
        case "B":
            removeError(answerInp)
            answerInp.classList.add("error-msg", "error-green")
            compareStringsAndHighlight(correctValue, userValue, correctionEl, "B")
            break;
        case "C":
            removeError(answerInp)
            answerInp.classList.add("error-msg", "error-yellow")
            compareStringsAndHighlight(correctValue, userValue, correctionEl, "C")
            break;
        case "D":
            removeError(answerInp)
            answerInp.classList.add("error-msg", "error-red")
            compareStringsAndHighlight(correctValue, userValue, correctionEl, "D")
            break;
        default:
            removeError(answerInp)
            correctionEl.textContent = "" 

    }
    resetBtn.focus()
}

function removeError(elt){
 elt.classList.remove("error-msg", "error-red", "error-yellow", "error-green")
}

function getMode(){
    let mode = ""
    const [of, co] = modeRadios
    if (co.checked){
        mode = co.value 
    }else if (of.checked){
        mode = of.value
    }
    return mode
}


function saveRadioMode(event) {
    const radio = event.target;
    if (radio.checked) {
        localStorage.setItem("selectedMode", radio.value);
    }
    if (radio.value === "co" && is24HourFormat(currentTime)){
        resetTime()
    }
}

function loadRadioMode() {
    const savedMode = localStorage.getItem("selectedMode");
    const [of, co] = modeRadios
    if (co.value === savedMode) {
        co.checked = true;
    }else{
        of.checked =true;
    }
}

modeRadios.forEach(radio => {
    radio.addEventListener("change", saveRadioMode);
});

resetBtn.addEventListener("click", resetTime)
answerInp.addEventListener("change", handleAnsInput)
init()
