const learnBtn = document.getElementById('learn-btn')
const pracBtn = document.getElementById('prac-btn')
const learnSec = document.querySelector(".learn-section")
const pracSec = document.querySelector(".practice-section")

function learnBtnHandler(){
    pracBtn.classList.remove("active")
    pracSec.classList.add("disabled")

    learnBtn.classList.add("active")
    learnSec.classList.remove("disabled")
}

function pracBtnHandler(){
    learnBtn.classList.remove("active")
    learnSec.classList.add("disabled")
    
    pracBtn.classList.add("active")
    pracSec.classList.remove("disabled")
}


learnBtn.addEventListener("click", learnBtnHandler)
pracBtn.addEventListener("click", pracBtnHandler)
