<<<<<<< HEAD
checkHeadphone = function () {
        window.plugins.headsetdetection.detect(function (detected) {
            alert("Headphone " + detected)
        })
    }
=======
document.addEventListener('DOMContentLoaded', () => {
    const timeLeftDisplay = document.querySelector('#time-left')
    const startBtn = document.querySelector('#startButton')
    let timeLeft = 15
    startBtn.addEventListener('click' ,function countDown() {
        setInterval(function () {
            if (timeLeft <= 0) {
                clearInterval(timeLeft = 0)
            }
            timeLeftDisplay.innerHTML = timeLeft
            timeLeft -= 1
        }, 1000)
    }
    )   
})
>>>>>>> 0a1ef404f1f39ab5fe85eea1825acebbd09e6785
