const learnBtn = document.getElementById('learn-btn')
const pracBtn = document.getElementById('prac-btn')
const learnSec = document.querySelector(".learn-section")
const pracSec = document.querySelector(".practice-section")

const menuBtn = document.getElementById("menu-btn")
const closeBtn = document.getElementById("close-nav-btn")
const mobileSideBar = document.querySelector(".mobile-sidebar")

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

function menuBtnHandler(){
    mobileSideBar.classList.remove("disabled")

}

function closeBtnHandler(){
    mobileSideBar.classList.add("disabled")
}

menuBtn.addEventListener("click", menuBtnHandler)
closeBtn.addEventListener("click", closeBtnHandler)

learnBtn.addEventListener("click", learnBtnHandler)
pracBtn.addEventListener("click", pracBtnHandler)
