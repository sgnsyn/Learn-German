const hourInput =document.getElementById("hour-input")
const minuteInput = document.getElementById('minute-input')



function inputFormatHandler(event){
    const input = event.target
    const value = input.value

    if (value.length == 1){
        input.value = `0${value}`
    }
}

hourInput.addEventListener("change", inputFormatHandler)
minuteInput.addEventListener("change", inputFormatHandler)
