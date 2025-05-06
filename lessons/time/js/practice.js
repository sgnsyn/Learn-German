import { getRandomTime,  getOfficialTime} from "./time-function.js";
import { evaluateTimeAnswer, compareStringsAndHighlight } from "./time-correction.js";


const timeDisplayElt = document.getElementById("practice-time")
const resetBtn = document.getElementById("reset-btn")
const answerInp = document.getElementById("answer-input")
const correctionEl = document.getElementById("correction-p")

let currentTime = ""

function init(){
    const randomTime = getRandomTime('24hr')
    const randomTimeStr = getOfficialTime( randomTime) 
    currentTime = randomTimeStr
    timeDisplayElt.textContent = randomTime
    answerInp.style.width = `${randomTimeStr.length + 2 +(Math.floor(Math.random() * 3) + 1)}ch` 
}

function resetHandler(){
    const randomTime = getRandomTime('24hr')
    const randomTimeStr = getOfficialTime(randomTime) 

    currentTime = randomTimeStr
    timeDisplayElt.textContent = randomTime

    answerInp.style.width = `${randomTimeStr.length + 2 +(Math.floor(Math.random() * 3) + 1)}ch` 
    answerInp.value = ""
    correctionEl.textContent= ""
    answerInp.focus()
    removeError(answerInp)
}

function handleAnsInput(event){
    const userValue = event.target.value 
    const correctValue = currentTime
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

resetBtn.addEventListener("click", resetHandler )
answerInp.addEventListener("change", handleAnsInput)
init()
