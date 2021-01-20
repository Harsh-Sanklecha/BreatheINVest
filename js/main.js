var d = new Date();

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
    $(location).attr('href', result+'.html');
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



$(document).ready(function () {
    $("#reportDownload").click(function(){
        var Pname = $("#patientName").val();
        var age = $("#patientAge").val();
        var gender = $("#patientGender").val();

        sessionStorage.setItem("Pname", Pname);
        sessionStorage.setItem("age", age);
        sessionStorage.setItem("gender", gender);

        
        console.log(Pname,age,gender);
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



jQuery(document).ready(function () {
    var $ = jQuery;
    var myRecorder = {
        objects: {
            context: null,
            stream: null,
            recorder: null
        },
        init: function () {
            if (null === myRecorder.objects.context) {
                myRecorder.objects.context = new (
                    window.AudioContext || window.webkitAudioContext
                );
            }
        },
        start: function () {
            var options = { audio: true, video: false };
            navigator.mediaDevices.getUserMedia(options).then(function (stream) {
                myRecorder.objects.stream = stream;
                myRecorder.objects.recorder = new Recorder(
                    myRecorder.objects.context.createMediaStreamSource(stream),
                    { numChannels: 1 }
                );
                myRecorder.objects.recorder.record();
            }).catch(function (err) { });
        },
        stop: function (listObject) {
            if (null !== myRecorder.objects.stream) {
                myRecorder.objects.stream.getAudioTracks()[0].stop();
            }
            if (null !== myRecorder.objects.recorder) {
                myRecorder.objects.recorder.stop();

                // Validate object
                if (null !== listObject
                    && 'object' === typeof listObject
                    && listObject.length > 0) {
                    // Export the WAV file
                    myRecorder.objects.recorder.exportWAV(function (blob) {
                        var url = (window.URL || window.webkitURL)
                            .createObjectURL(blob);

                        // Prepare the playback
                        var audioObject = $('<audio controls></audio>')
                            .attr('src', url);

                        // Prepare the download link
                        var downloadObject = $('<a>&#9660;</a>')
                            .attr('href', url)
                            .attr('download', new Date().toUTCString() + '.wav');

                        // Wrap everything in a row
                        var holderObject = $('<div class="row"></div>')
                            .append(audioObject)
                            .append(downloadObject);

                        // Append to the list
                        listObject.append(holderObject);
                    });
                }
            }
        }
    };

    // Prepare the recordings list
    var listObject = $('[data-role="recordings"]');

    // Prepare the record button
    $('[data-role="controls"] > button').click(function () {
        // Initialize the recorder
        myRecorder.init();

        // Get the button state 
        var buttonState = !!$(this).attr('data-recording');

        // Toggle
        if (!buttonState) {
            $(this).attr('data-recording', 'true');
            myRecorder.start();
        } else {
            $(this).attr('data-recording', '');
            myRecorder.stop(listObject);
        }
    });
});


if ('serviceWorker' in navigator) {
    console.log("Will service worker register?");
    navigator.serviceWorker.register('serviceWorker.js').then(function (reg) {
        console.log("Yes it did.");
    }).catch(function (err) {
        console.log("No it didn't. This happened: ", err)
    });
}