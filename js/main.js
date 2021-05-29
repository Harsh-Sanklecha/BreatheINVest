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
			recorder.stop();
			stops();
		}
		timeLeftDisplay.innerHTML = sec;
	}, 1000);
}

/* TimerStop Function */
function myTimerStop() {
	clearInterval(timer);
	sec = 15;
	timeLeftDisplay.innerHTML = sec;
	noLoop();
}

let label = 'waiting...';

// Classifier and model url
let classifier;
let modelURL = 'https://teachablemachine.withgoogle.com/models/z-nWfQWiC/';
// STEP 1: Load the model!

classifier = ml5.soundClassifier(modelURL + 'model.json');

let mic, recorder, soundFile;

function setup() {
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

	console.log('Printing:');
	for (var i = 0; i < a.length; i++) {
		if (a[i] == 'Normal') {
			normal++;
		}
		if (a[i] == 'Wheezes') {
			asthama++;
		}
		if (a[i] == 'Crackles') {
			cw++;
		}
		if (a[i] == 'Pneumonia(Suspected Covid-19)') {
			covid++;
		}
	}

	result = 'normal';
	max = normal;

	if (asthama > max) {
		max = asthama;
		result = 'wheezes';
	}
	// if (covid > max) {
	//     max = covid;
	//     result = "Pneumonia(Suspected Covid-19)"
	// }
	if (cw > max) {
		max = cw;
		result = 'crackles';
	}
	//else{
	//    $(location).attr('href', 'normal.html');
	//}
	
    let total=cw+asthama+normal
	let normal_percentage = (normal/total)*100;
	let cw_percentage = (cw/total)*100;
	let asthama_percentage = (asthama/total)*100;


	var ctx = document.getElementById('myChart').getContext('2d');
	var myChart = new Chart(ctx, {
		type: 'doughnut',
		data: {
			labels: ['Normal', 'Crackles', 'Wheezes'],
			datasets: [
				{
					label: '# of Votes',
					data: [normal_percentage, cw_percentage , asthama_percentage],
					backgroundColor: [
						'rgba(255, 99, 132, 0.2)',
						'rgba(54, 162, 235, 0.2)',
						'rgba(255, 206, 86, 0.2)',
						'rgba(75, 192, 192, 0.2)',
					],
					borderColor: [
						'rgba(255, 99, 132, 1)',
						'rgba(54, 162, 235, 1)',
						'rgba(255, 206, 86, 1)',
						'rgba(75, 192, 192, 1)',
					],
					borderWidth: 1,
				},
			],
		},
		// options: {
		//     scales: {
		//         y: {
		//             beginAtZero: true
		//         }
		//     }
		// }
	});
	console.log('Result:' + result);
	$('#timerPage').css('display', 'none');
	console.log('crackles:' + cw_percentage);
	console.log('wheezes:' + asthama_percentage);
	console.log('Normal:' + normal_percentage);
	console.log('Pneumonia(Suspected Covid-19):' + (covid/total)*100);
	if ((normal_percentage)>60) {
		console.log('Normal');
		document.getElementById("kuchaur").innerHTML="Normal";
		} 
	else{
		console.log('Abnormal');
		document.getElementById("kuchaur").innerHTML="Abnormal";
	}
    document.getElementById("kyatohbhi").innerHTML="Breathe Health Rate: "+(normal_percentage). toFixed(2)+"%";
	$('#normal').css('display', 'block');

	// $(location).attr('href', result+'.html');
}

/* Start Button */
$('#startButton').click(function () {
	if (mic.enabled) {
		recorder.record(soundFile);
	} else {
		alert('Give Permissions to record');
	}
	myTimer(15);
	$('#startButton').css('display', 'none');
	$('#stopButton').css('display', 'block');
});

/* Stop Button */
$('#stopButton').click(function () {
	myTimerStop();
	recorder.stop();
	$('#stopButton').css('display', 'none');
	$('#startButton').css('display', 'block');
});

function playFile() {
	soundFile.play();
}
function saveFile() {
	saveSound(soundFile, 'mySound.wav');
}

$(document).ready(function () {
	$('#reportDownload').click(function () {
		var Pname = $('#patientName').val();
		var age = $('#patientAge').val();
		var gender = $('#patientGender').val();

		sessionStorage.setItem('Pname', Pname);
		sessionStorage.setItem('age', age);
		sessionStorage.setItem('gender', gender);
	});
});

$(document).ready(function () {
	reportPname = sessionStorage.getItem('Pname');
	reportage = sessionStorage.getItem('age');
	reportgender = sessionStorage.getItem('gender');
	var strDate = d.getDate() + '-' + (d.getMonth() + 1) + '-' + d.getFullYear();

	$('#reportDate').html(strDate);
	$('#reportPatientName').html(reportPname);
	$('#reportPatientAge').html(reportage);
	$('#reportPatientGender').html(reportgender);
});

if ('serviceWorker' in navigator) {
	console.log('Will service worker register?');
	navigator.serviceWorker
		.register('serviceWorker.js')
		.then(function (reg) {
			console.log('Yes it did.');
		})
		.catch(function (err) {
			console.log("No it didn't. This happened: ", err);
		});
}
