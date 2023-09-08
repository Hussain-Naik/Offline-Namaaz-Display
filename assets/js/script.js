let ctime = document.getElementById("fullTime");
let cSec = document.getElementById("seconds");
let cAMPM = document.getElementById("ampm");
let cDay = document.getElementById("day");
let cDate = document.getElementById("date");

cDay.innerHTML = writeDay();
cDate.innerHTML = writeDate();

document.addEventListener("DOMContentLoaded", function() {
    let main = document.querySelector('main');
    main.addEventListener('click', function() {
        document.getElementById('toggle').checked = false;
    })
	let form = document.getElementById('menu');
    form.lastElementChild.addEventListener('click', function(event) {
        event.preventDefault()
        console.log('new page')
        
    })
    let label = form.querySelectorAll('label').forEach(label => {
        label.innerHTML = label.innerText.split('').map(
            (letters, i) => `<span style='transition-delay: ${i * 50}ms'>${letters}</span>`
        ).join(' ');
    })

    let inputs = form.querySelectorAll('input');
    for (let input of inputs) {
        if (input.type != 'submit') {
            input.value = localStorage.getItem(input.id);
            input.addEventListener('keydown', function(event) {
                if (event.key === "Enter") {
                    inputUpdate(input.id, input.value);
                    event.preventDefault()
                }
            });
        }
	}

});



function inputUpdate(id, input) {
    localStorage.setItem(id, input)
}

function getActiveNamaaz() {
    let activeNamaaz = document.getElementsByClassName('active')[0];
    return activeNamaaz;
}
function checkTimer(namaaz, date) {
    let currentTime = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
    let namaazTime
    if (namaaz.getAttribute('id') == 'fajr' || namaaz.getAttribute('id') == 'eid') {
        namaazTime = namaaz.lastElementChild.innerText;
    }
    else{
        namaazTime = add12Hours(namaaz.lastElementChild.innerText)
    }
    let timer = returnTimeDifference(currentTime , namaazTime)
    if (timer < 0) {
        namaaz.classList.remove('active');
    }
    //console.log(timer)
}

function add12Hours(timeParameter) {
    let arrayTime = timeParameter.split(":");
    if (Number(arrayTime[0]) < 12) {
        arrayTime[0] += 12;
    }
    return arrayTime[0] + ':' + arrayTime[1];
}

function convertToSeconds(timeParameter) {
    let arrayTime = timeParameter.split(":");
    arrayTime.forEach(mySecondsFunction);
    let sum = arrayTime.reduce((partialSum, a) => partialSum + a, 0)
    return sum
}

function mySecondsFunction(item, index, arr) {
    arr[index] = item * 3600 / (60 ** index);
    
}
function returnTimeDifference(currentTime, namaazTime) {
    let cTSec = convertToSeconds(currentTime);
    let nTSec = convertToSeconds(namaazTime)
    let result = nTSec - cTSec;
    return result
}

function formatTIME12H(date) {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let ampm = hours >= 12 ? 12 :0;
    hours = hours % 12;
    hours = hours ? hours :ampm; // the hour '0' should be '12'
    hours = hours < 10 ? '0' + hours :hours;
    minutes = minutes < 10 ? '0' + minutes :minutes;
    let strTime = hours + ':' + minutes;
    return strTime;
}

function writeDate() {
    let d = new Date();
	let iMonthNames = new Array("January", "February", "March", "April",
		"May", "June", "July", "August",
		"September", "October", "November", "December");
	let outputDate = d.getDate() + " " + iMonthNames[d.getMonth()] + " " + d.getFullYear();
	return outputDate;
}
function writeDay() {
    let d = new Date();
	let iDayNames = new Array("Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday");
	let iDate = d.getDay();
	let outputDay = iDayNames[iDate];
	return outputDay;
}

setInterval(() => {
    let d = new Date();
    let dHours = d.getHours();
    let dMinutes = d.getMinutes();
    let dSec = d.getSeconds() < 10 ? '0' + d.getSeconds() : d.getSeconds();
    let ampm = dHours >= 12 ? 'pm' : 'am';
    let activeNamaaz = getActiveNamaaz();

    ctime.innerHTML = formatTIME12H(d);
    checkTimer(activeNamaaz, d)
    cSec.innerHTML = dSec;
    cAMPM.innerHTML = ampm;
    if (dHours == 0 && dMinutes == 0 && dSec == 0) { location.reload(); }

}, 1000)