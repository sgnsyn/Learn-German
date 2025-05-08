import {getOfficialTime, getRandomTime, getUnofficialTime} from "../js/time-function.js"

const hourInput = document.getElementById("hour-input")
const minuteInput = document.getElementById('minute-input')
const incBtns = document.querySelectorAll(".inc-btn")

const ofTimeP = document.querySelector(".of-time-inword")
const coTimeDiv = document.querySelector(".co-time-inword")

/******************** Handle Time mechanics begin *************************/
    function handleInc(event){
    const btn = event.target
    const name = btn.dataset.name
    const op = btn.dataset.op

    if (name === "hour"){
        let time =parseInt(hourInput.textContent);
        if (op === "add"){
            time++ 
        }
        if (op == "min"){
            time--
        }

        time =  checkBoundary("hour", time)
        time = padding(time)
        hourInput.textContent = time
    }

    if (name === "minute"){
        let time =parseInt(minuteInput.textContent);
        if (op === "add"){
            time++ 
        }
        if (op == "min"){
            time--
        }

        time =  checkBoundary(name, time)
        time = padding(time)
        minuteInput.textContent = time
    }

}

function checkBoundary(type, value){

    if (type === "minute"){
        if (value > 59){
            const aBtn= document.querySelector(`button[data-name='hour'][data-op='add']`)
            aBtn.click()
            return  0
        }
        if (value < 0){
            const aBtn = document.querySelector(`button[data-name='hour'][data-op='min']`)
            aBtn.click()
            return 59
        }
    }

    if (type === "hour"){
        if (value > 23){
            return 0 
        }
        if (value < 0){
            return 23
        }
    }
    return value
}



function padding(value){
    return value.toString().padStart(2,0);
}

export function handleTimeMechanics(btn, hourInput, minuteInput){
    let holdInterval;
    let holdTimeout;

    btn.addEventListener('click', handleInc);
    btn.addEventListener('touchstart', handleInc);

    btn.addEventListener('mousedown', (event) => {
        holdTimeout = setTimeout(() => {
            holdInterval = setInterval(() => {
                handleInc(event); // Simulate click event
            }, 100); 
        }, 200); 
    });


    btn.addEventListener('mouseup', () => {
        clearTimeout(holdTimeout);
        clearInterval(holdInterval);
    });

    btn.addEventListener('mouseleave', () => {
        clearTimeout(holdTimeout);
        clearInterval(holdInterval);
    });


    btn.addEventListener('touchstart', (event) => {
        event.preventDefault(); 
        holdTimeout = setTimeout(() => {
            holdInterval = setInterval(() => {
                handleInc(event); 
            }, 100);
        }, 400);
    });

    btn.addEventListener('touchend', () => {
        clearTimeout(holdTimeout);
        clearInterval(holdInterval);
    });
}

/************************ Handle Time mechanics End **********************/
function updateTimeText(){
    const currentTime = `${hourInput.textContent.trim()}:${minuteInput.textContent.trim()}`
    const officalTime = getOfficialTime(currentTime)
    const coTimeArr = getUnofficialTime(currentTime)

    ofTimeP.textContent =`Es ist ${officalTime}.` 

    let coEl = ""
    coTimeArr.forEach(time =>{
        coEl  += `<p class="telling casual-telling telling-text">
            ES ist ${time}.
            </p>
            `
    })

    coTimeDiv.innerHTML = coEl
}

function init(){
    const ct = getRandomTime("co").split(":")
    const [hr, mn] = ct
    hourInput.textContent = hr
    minuteInput.textContent = mn

    updateTimeText()
}


incBtns.forEach(btn => {
    handleTimeMechanics(btn, hourInput, minuteInput)
    btn.addEventListener("click", updateTimeText)
});

init()



