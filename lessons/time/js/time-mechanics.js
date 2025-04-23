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

function handleTimeMechanics(btn, hourInput, minuteInput){
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


