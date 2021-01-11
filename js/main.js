/* Timer Logic */
var timer;
const timeLeftDisplay = document.querySelector('#time-left');
function myTimer(sec) {
    clearInterval(timer);
    timer = setInterval(function () {
        $('#timer').text(sec--);
        if (sec == 0) {
            clearInterval(timer);
            stops();
            // $(location).attr('href', 'http://127.0.0.1:5500/normal.html')
        }
        timeLeftDisplay.innerHTML = sec
    }, 1000);
}

/* TimerStop Function */
function myTimerStop() {
    clearInterval(timer);
    sec = 15;
    timeLeftDisplay.innerHTML = sec;
    noLoop();
}


let label = "waiting...";

// Classifier and model url
let classifier;
let modelURL = 'https://teachablemachine.withgoogle.com/models/z-nWfQWiC/';
// STEP 1: Load the model!

classifier = ml5.soundClassifier(modelURL + 'model.json');
function setup() {

    classifyAudio();
    noLoop();
}

// STEP 2 classify!
function classifyAudio() {
    classifier.classify(gotResults);
}


// STEP 3: Get the classification!
function gotResults(error, results) {
    if (error) {
        console.error(error);
        return;
    }
    // Store the label
    label = results[0].label;
}
var a = [];
var asthama = 0;
var covid = 0;
var normal = 0;
var cw = 0;
function draw() {

    console.log(label);
    a.push(label);
}
function starts() {
    a = [];
    asthama = 0;
    covid = 0;
    normal = 0;
    cw = 0;
    loop();
    // document.getElementById("s").innerHTML = "Status: Now Recording";


}

function stops() {
    noLoop();
    // document.getElementById("s").innerHTML = "Status: Recorded";

    console.log("Printing:");
    for (var i = 0; i < a.length; i++) {
        if (a[i] == "Normal") {
            normal++;
        }
        if (a[i] == "Wheezes") {
            asthama++;
        }
        if (a[i] == "Crackles") {
            cw++;
        }
        if (a[i] == "Pneumonia(Suspected Covid-19)") {
            covid++;
        }


    }
    result = "Normal"
    max = normal
    if (asthama > max) {
        max = asthama;
        $(location).attr('href', 'wheezes.html');
        result = "Wheezes"
    }
    if (covid > max) {
        max = covid;
        result = "Pneumonia(Suspected Covid-19)"
    }
    if (cw > max) {
        max = cw;
        $(location).attr('href', 'crackles.html');
        result = "Crackles"

    }
    else{
        $(location).attr('href', 'normal.html');
    }

    // document.getElementById("result").innerHTML = "Result:" + result;
    console.log("Result:" + result);
}


/* Start Button */
$('#startButton').click(function(){
    myTimer(15);
    $('#startButton').css("display", "none");
    $('#stopButton').css("display","block");
});

/* Stop Button */
$('#stopButton').click(function(){
    myTimerStop();
    $('#stopButton').css("display", "none");
    $('#startButton').css("display","block");
});
