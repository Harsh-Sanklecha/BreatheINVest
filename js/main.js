var d = new Date();

/* Timer Logic */
var timer;
const timeLeftDisplay = document.querySelector('#time-left');
function myTimer(sec) {
    clearInterval(timer);
    timer = setInterval(function () {
        $('#timer').text(sec--);
        if (sec == 0) {
            recorder.stop();
            clearInterval(timer);
            stops();
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


let mic, recorder, soundFile;

function setup() {

    classifyAudio();
    noLoop();

    // create an audio in
    mic = new p5.AudioIn();

    // users must manually enable their browser microphone for recording to work properly!
    mic.start();

    // create a sound recorder
    recorder = new p5.SoundRecorder();

    // connect the mic to the recorder
    recorder.setInput(mic);

    // create an empty sound file that we will use to playback the recording
    soundFile = new p5.SoundFile();
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


}

function stops() {
    noLoop();

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
    
    result = "normal"
    max = normal
    
    if (asthama > max) {
        max = asthama;
        result = "wheezes"
    }
    // if (covid > max) {
    //     max = covid;
    //     result = "Pneumonia(Suspected Covid-19)"
    // }
    if (cw > max) {
        max = cw;
        result = "crackles"

    }
    //else{
    //    $(location).attr('href', 'normal.html');
    //}

    console.log("Result:" + result);
    $("#timerPage").css("display","none");
    $("#"+result).css("display","block")
    // $(location).attr('href', result+'.html');
}

/* Start Button */
$('#startButton').click(function(){
    recorder.record(soundFile);
    myTimer(15);
    $('#startButton').css("display", "none");
    $('#stopButton').css("display","block");
});

/* Stop Button */
$('#stopButton').click(function () {
    recorder.stop();
    myTimerStop();
    $('#stopButton').css("display", "none");
    $('#startButton').css("display","block");
});

function playFile() {
    soundFile.play();
}
function saveFile() {
    saveSound(soundFile, 'mySound.wav');
}

$(document).ready(function () {
    $("#reportDownload").click(function(){

        var Pname = $("#patientName").val();
        var age = $("#patientAge").val();
        var gender = $("#patientGender").val();

        sessionStorage.setItem("Pname", Pname);
        sessionStorage.setItem("age", age);
        sessionStorage.setItem("gender", gender);
    });
});

$(document).ready(function () {

    reportPname = sessionStorage.getItem("Pname");
    reportage = sessionStorage.getItem("age");
    reportgender = sessionStorage.getItem("gender");
    var strDate = d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear();

    $("#reportDate").html(strDate);
    $("#reportPatientName").html(reportPname);
    $("#reportPatientAge").html(reportage);
    $("#reportPatientGender").html(reportgender);
});


if ('serviceWorker' in navigator) {
    console.log("Will service worker register?");
    navigator.serviceWorker.register('serviceWorker.js').then(function (reg) {
        console.log("Yes it did.");
    }).catch(function (err) {
        console.log("No it didn't. This happened: ", err)
    });
}
