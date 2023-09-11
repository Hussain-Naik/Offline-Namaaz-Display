let ctime = document.getElementById("fullTime");
let cSec = document.getElementById("seconds");
let cAMPM = document.getElementById("ampm");
let cDay = document.getElementById("day");
let cDate = document.getElementById("date");
let cIDate = document.getElementById("hijri");
let eidTime = document.getElementById("eidJamaat");
let message = document.getElementById("announcements");

//const wdNames = new Array("Ahad","Ithnin","Thulatha","Arbaa","Khams","Jumuah","Sabt");
const iMonthNames = new Array("Muharram","Safar","Rabi'ul Awwal","Rabi'ul Akhir",
"Jumadal Awwal","Jumadal Akhir","Rajab","Sha'ban",
"Ramadan","Shawwal","Dhul Qa'ada","Dhul Hijja");

const adjustIDate = localStorage.getItem('inputAdjustIDate');
const eidNamaazTime = localStorage.getItem('inputEidTime');
const announcements = localStorage.getItem('inputAnnouncements');
const namaazData = JSON.parse(localStorage.getItem('NamaazData'));
const islamicDate = [ writeIslamicDate(adjustIDate) , writeIslamicDate(adjustIDate + 1) ];
// testing const islamicDate = ['30 Ramadan 1445', '1 Shawwal 1445' ];


cDay.innerHTML = writeDay();
cDate.innerHTML = writeDate();
cIDate.innerHTML = islamicDate[0];
eidTime.innerHTML = eidNamaazTime;
eidTime.parentElement.setAttribute('data-type', eidNamaazTime)
message.innerHTML += announcements;

populateTimes();

let isEid = checkEidDay();
toggleEid();

document.addEventListener("DOMContentLoaded", function() {
    let main = document.querySelector('main');
    main.addEventListener('click', function() {
        document.getElementById('toggle').checked = false;
    })
	
	let form = document.getElementById('menu');
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

function populateTimes() {
	let today = new Date();
	let d = today.getDate() < 10 ? '0' + today.getDate() : today.getDate();
	let m = (today.getMonth() + 1);
	m = m < 10 ? '0' + m : m;
	let y = today.getFullYear();
	let dateString = d + '/' + m + '/' + y;
	let tomorrow = getDateByOffset(today, 1)
	if (tomorrow.slice(-1) != dateString.slice(-1)) {
		tomorrow = tomorrow.slice(0,-1) + dateString.slice(-1)
	}
	let currentTimes = namaazData[dateString];
	let nextTimes = namaazData[tomorrow]
	let cStart = document.getElementsByClassName('cStart');
	let cJamaat = document.getElementsByClassName('cJamaat');
	let nStart = document.getElementsByClassName('nStart');
	let nJamaat = document.getElementsByClassName('nJamaat');
	let istiwaHTML = document.getElementById('zawaal');
	let istiwa = returnTimeDifference(currentTimes['Sunrise'], add12Hours(currentTimes['Maghrib Start']))
	istiwaHTML.innerHTML = convertToTime(istiwa, -5);
	istiwaHTML.setAttribute('data-type', convertToTime(istiwa, -5))
	for (let i = 0; i < 5; i++) {
		cStart[i].innerHTML = currentTimes[cStart[i].getAttribute('data-target')];
		cJamaat[i].innerHTML = currentTimes[cJamaat[i].getAttribute('data-target')];
		nStart[i].innerHTML = nextTimes[nStart[i].getAttribute('data-target')];
		nJamaat[i].innerHTML = nextTimes[nJamaat[i].getAttribute('data-target')];
		cStart[i].parentElement.setAttribute('data-type', currentTimes[cJamaat[i].getAttribute('data-target')])
	}
	let cXInfo = document.getElementsByClassName('cXInfo');
	let nXInfo = document.getElementsByClassName('nXInfo');
	for (let i = 0; i < 2; i++) {
		cXInfo[i].innerHTML = currentTimes[cXInfo[i].getAttribute('data-target')]
		cXInfo[i].setAttribute('data-type', currentTimes[cXInfo[i].getAttribute('data-target')])
		nXInfo[i].innerHTML = nextTimes[nXInfo[i].getAttribute('data-target')]
		nXInfo[i].setAttribute('data-type', nextTimes[nXInfo[i].getAttribute('data-target')])
	}


}

function getDateByOffset(start, offset) {
	var date = new Date(start || Date.now());
	var n = Number(offset);

	if (n !== n || date.toString() == "Invalid Date") { return date; }

	date.setDate(date.getDate() + n);

	let d = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
	let m = (date.getMonth() + 1);
	m = m < 10 ? '0' + m : m;
	let y = date.getFullYear();
	let dateString = d + '/' + m + '/' + y;
  return dateString;
}

function gmod(n,m){
	return ((n%m)+m)%m;
}

function kuwaiticalendar(adjust){
	let today = new Date();
	if(adjust) {
		adjustmili = 1000*60*60*24*adjust; 
		todaymili = today.getTime()+adjustmili;
		today = new Date(todaymili);
	}
	day = today.getDate();
	month = today.getMonth();
	year = today.getFullYear();
	m = month+1;
	y = year;
	if(m<3) {
		y -= 1;
		m += 12;
	}

	a = Math.floor(y/100.);
	b = 2-a+Math.floor(a/4.);
	if(y<1583) b = 0;
	if(y==1582) {
		if(m>10)  b = -10;
		if(m==10) {
			b = 0;
			if(day>4) b = -10;
		}
	}

	jd = Math.floor(365.25*(y+4716))+Math.floor(30.6001*(m+1))+day+b-1524;

	b = 0;
	if(jd>2299160){
		a = Math.floor((jd-1867216.25)/36524.25);
		b = 1+a-Math.floor(a/4.);
	}
	bb = jd+b+1524;
	cc = Math.floor((bb-122.1)/365.25);
	dd = Math.floor(365.25*cc);
	ee = Math.floor((bb-dd)/30.6001);
	day =(bb-dd)-Math.floor(30.6001*ee);
	month = ee-1;
	if(ee>13) {
		cc += 1;
		month = ee-13;
	}
	year = cc-4716;

	if(adjust) {
		wd = gmod(jd+1-adjust,7)+1;
	} else {
		wd = gmod(jd+1,7)+1;
	}

	iyear = 10631./30.;
	epochastro = 1948084;
	epochcivil = 1948085;

	shift1 = 8.01/60.;
	
	z = jd-epochastro;
	cyc = Math.floor(z/10631.);
	z = z-10631*cyc;
	j = Math.floor((z-shift1)/iyear);
	iy = 30*cyc+j;
	z = z-Math.floor(j*iyear+shift1);
	im = Math.floor((z+28.5001)/29.5);
	if(im==13) im = 12;
	id = z-Math.floor(29.5001*im-29);

	var myRes = new Array(8);

	myRes[0] = day; //calculated day (CE)
	myRes[1] = month-1; //calculated month (CE)
	myRes[2] = year; //calculated year (CE)
	myRes[3] = jd-1; //julian day number
	myRes[4] = wd-1; //weekday number
	myRes[5] = id; //islamic date
	myRes[6] = im-1; //islamic month
	myRes[7] = iy; //islamic year

	return myRes;
}
function writeIslamicDate(adjustment) {
	let iDate = kuwaiticalendar(adjustment);
	//let dateID = adjustID + iDate[5];
    let dateID = iDate[5];
	//let outputIslamicDate = wdNames[iDate[4]] + ", " + iDate[5] + " " + iMonthNames[iDate[6]] + " " + iDate[7] + " AH";
	let outputIslamicDate = dateID + " " + iMonthNames[iDate[6]] + " " + iDate[7];
	return outputIslamicDate;
}

function checkEidDay() {
	let bool1 = false;
	let bool2 = false;
	let bool = false;
	let outputIslamicDate = cIDate.innerHTML.slice(0, -5)
	bool1 = outputIslamicDate == "10 Dhul Hijja" ? true : false;
	bool2 = outputIslamicDate == "1 Shawwal" ? true : false;
	bool = bool1 || bool2 ? true : false;
	return bool;
}

function toggleEid() {
	let eidHTML = document.getElementById('eid');
	if (isEid == true) {
		eidHTML.classList.replace('hidden', 'visible')
	}
	else {
		eidHTML.classList.add('hidden')
	}
	
}
function inputUpdate(id, input) {
    localStorage.setItem(id, input)
}

function getActiveNamaaz() {
    let activeNamaaz = document.getElementsByClassName('active')[0];
    return activeNamaaz;
}
function checkTimer(namaaz, date) {
    let currentTime = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
    let namaazTime;
    if (namaaz.getAttribute('id') == 'fajr' || namaaz.getAttribute('id') == 'eid') {
        namaazTime = namaaz.getAttribute('data-type');
    }
    else{
        namaazTime = add12Hours(namaaz.getAttribute('data-type'))
    }
    let timer = returnTimeDifference(currentTime , namaazTime)
    if (timer < 0) {
        namaaz.classList.remove('active');
		if (namaaz.getAttribute('id') != 'eid') {
			namaaz.getElementsByClassName('cStart')[0].classList.replace('visible', 'hidden');
			namaaz.getElementsByClassName('cJamaat')[0].classList.replace('visible', 'hidden');
			namaaz.getElementsByClassName('nStart')[0].classList.replace('hidden', 'visible');
			namaaz.getElementsByClassName('nJamaat')[0].classList.replace('hidden', 'visible');
		}
		if (namaaz.getAttribute('id') == 'maghrib') {
			cIDate.innerHTML = islamicDate[1];
			isEid = checkEidDay();
			toggleEid();
		}
		
    }
    //console.log(timer)
}

function add12Hours(timeParameter) {
    let arrayTime = timeParameter.split(":");
    if (Number(arrayTime[0]) < 12) {
        arrayTime[0] = Number(arrayTime[0]) + 12;
    }
    return arrayTime[0] + ':' + arrayTime[1];
}

function convertToSeconds(timeParameter) {
    let arrayTime = timeParameter.split(":");
    arrayTime.forEach(mySecondsFunction);
    let sum = arrayTime.reduce((partialSum, a) => partialSum + a, 0)
    return sum
}

function convertToTime(seconds, offset) {
	let total = (offset == undefined) ? seconds : seconds + (offset * 60);
    let h = Math.floor(total / 3600);
    let m = total % 3600;
    let s = m % 60;
    m = Math.floor(m / 60);
    m = checkTime(m);
    h = checkTime(h);
    s = checkTime(s);
    return h + ':' + m ;
}

function checkTime(i) {
    if (i < 10) {i = "0" + i;}
    return i;
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
    hours = checkTime(hours);
    minutes = checkTime(minutes);
    let strTime = hours + ':' + minutes;
    return strTime;
}

function writeDate() {
    let d = new Date();
	let gMonthNames = new Array("January", "February", "March", "April",
		"May", "June", "July", "August",
		"September", "October", "November", "December");
	let outputDate = d.getDate() + " " + gMonthNames[d.getMonth()] + " " + d.getFullYear();
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
    let dSec = checkTime(d.getSeconds());
    let ampm = dHours >= 12 ? 'pm' : 'am';
    let activeNamaaz = getActiveNamaaz();

    ctime.innerHTML = formatTIME12H(d);
    checkTimer(activeNamaaz, d)
    cSec.innerHTML = dSec;
    cAMPM.innerHTML = ampm;
    if (dHours == 0 && dMinutes == 0 && dSec == 0) { location.reload(); }

}, 1000)