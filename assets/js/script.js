let ctime = document.getElementById("fullTime");
let cSec = document.getElementById("seconds");
let cAMPM = document.getElementById("ampm");
let cDay = document.getElementById("day");
let cDate = document.getElementById("date");
let cIDate = document.getElementById("hijri");
let eidJamaat = document.getElementById("eidJamaat");
let eidTime = document.getElementById("eidTime");
let message = document.getElementById("announcements");

//const wdNames = new Array("Ahad","Ithnin","Thulatha","Arbaa","Khams","Jumuah","Sabt");
const iMonthNames = new Array("Muharram","Safar","Rabi'ul Awwal","Rabi'ul Akhir",
"Jumadal Awwal","Jumadal Akhir","Rajab","Sha'ban",
"Ramadan","Shawwal","Dhul Qa'ada","Dhul Hijja");

const adjustIDate = Number(localStorage.getItem('inputAdjustIDate'));
const eidNamaazTime = localStorage.getItem('inputEidTime');
const announcements = localStorage.getItem('inputAnnouncements');
const slideTimer = Number(localStorage.getItem('inputSlideTimer'));
const slideDuration = Number(localStorage.getItem('inputSlideDuration'));
const namaazData = JSON.parse(localStorage.getItem('NamaazData'));
const islamicDate = [ writeIslamicDate(adjustIDate) , writeIslamicDate(adjustIDate + 1) ];
//const islamicDate = ['30 Ramadan 1445', '1 Shawwal 1445' ];
//const islamicDate = ['10 Dhul Hijja 1445', '11 Dhul Hijja 1445' ];
//const islamicDate = ['9 Dhul Hijja 1445', '10 Dhul Hijja 1445' ];
//const islamicDate = ['19 Ramadan 1445', '20 Ramadan 1445' ];

let timer = 0;
let sequence = 1;
let sEnable = true;

cDay.innerHTML = writeDay();
cDate.innerHTML = writeDate();
cIDate.innerHTML = islamicDate[0];
eidJamaat.innerHTML = eidNamaazTime;
eidJamaat.parentElement.setAttribute('data-type', eidNamaazTime)
eidTime.innerHTML = eidNamaazTime;
message.innerHTML += announcements;

populateTimes();
updateFocus();

displayEidName();

let isEid = checkEidDay();
toggleEid();
let isEidCounter = checkEidCountdown();
toggleEidNotification();
checkJummah();

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
		else{
			input.addEventListener('click', function(event) {
                event.preventDefault();
				clickEditSlides(this);
            });
		}
	}
	populateSlides();
});

function addSlides(input) {
	inputUpdate(input.id, input.value);
	updateSlidePicker(input.value)
}

function updateSlidePicker(count) {
	let slideItems = document.getElementsByClassName('slidesOption')
	let check = Number(count) + 3;
	if (check > slideItems.length) {
		makeSlideDiv('show', count)
	}
	else {
		let form = document.getElementById('menu')
		form.removeChild(form.lastElementChild)
	}
}

function makeSlideDiv(arg, x) {
	let form = document.getElementById('menu');
	let newDiv = document.createElement("div");
	if (arg == 'hidden') {
		newDiv.setAttribute('class', 'inputBox slidesOption flexPicker hidden')
	}
	else {
		newDiv.setAttribute('class', 'inputBox slidesOption flexPicker visible')
	}
	let newFInput = document.createElement("input");
	newFInput.setAttribute('type', 'file')
	newFInput.setAttribute('accept' , '.jpg')
	newFInput.setAttribute('onchange' , 'updateInput(this)')
	newFInput.setAttribute('id' , 'slideImage' + x)
	let newDInput = document.createElement("input");
	newDInput.setAttribute('type', 'text')
	newDInput.setAttribute('id' , 'slideImageD' + x)
	newDInput.setAttribute('disabled' , '')
	newDInput.value = localStorage.getItem('slideImage' + x);
	newDiv.appendChild(newFInput);
	newDiv.appendChild(newDInput);
	form.appendChild(newDiv);
}

function clickEditSlides(arg) {
	let mainSelection = document.getElementsByClassName('mainOptions');
	let slideSelection = document.getElementsByClassName('slidesOption');
	if(arg.parentElement.getAttribute('data-type') == 'mainOptions') {
		switchFunc(mainSelection, 'hide');
		switchFunc(slideSelection, 'show');
		arg.parentElement.setAttribute('data-type', 'slidesOption');
		arg.value = 'Back';
	}
	else {
		switchFunc(mainSelection, 'show');
		switchFunc(slideSelection, 'hide');
		arg.parentElement.setAttribute('data-type', 'mainOptions');
		arg.value = 'Edit Slides';
	}
}

function populateSlides() {
	let x = document.getElementById('inputSlideCount').value;
	for (let i = 0; i < x; i++) {
		makeSlideDiv('hidden', i + 1)
	}
}

function switchFunc(selection, type) {
	for (let i = 0; i < selection.length; i++) {
		if (type == 'hide') {
			selection[i].classList.replace('visible', 'hidden')
		}
		else {
			selection[i].classList.replace('hidden', 'visible')
		}
	}
}

function updateFocus() {
	let infoItems = document.getElementsByClassName('focus');
	if (infoItems.length == 1){
		infoItems[0].classList.replace('focus','fLast')
	}
	else if (infoItems.length > 1) {
		infoItems[0].classList.add('fFirst')
	}
}

function populateTimes() {
	let today = new Date();
	let d = today.getDate() < 10 ? '0' + today.getDate() : today.getDate();
	let m = (today.getMonth() + 1);
	m = m < 10 ? '0' + m : m;
	let y = today.getFullYear();
	let dateString = d + '/' + m;
	let tomorrow = getDateByOffset(today, 1)
	console.log(tomorrow)
	let currentTimes = namaazData[dateString];
	let nextTimes = namaazData[tomorrow]
	
	let cStart = document.getElementsByClassName('cStart');
	let cJamaat = document.getElementsByClassName('cJamaat');
	let nStart = document.getElementsByClassName('nStart');
	let nJamaat = document.getElementsByClassName('nJamaat');
	let istiwaHTML = document.getElementById('zawaal');
	let istiwa = convertToSeconds(add12Hours(currentTimes['Zohar Start']))
	istiwaHTML.innerHTML = convertToTime(istiwa, -10);
	istiwaHTML.setAttribute('data-type', convertToTime(istiwa, -10))
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
	let dateString = d + '/' + m;
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

function returnIslamicDate(arg) {
	let outputIslamicDate = cIDate.innerHTML.slice(0, -5);
	let separator = outputIslamicDate.indexOf(' ');
	let iDate = outputIslamicDate.slice(0 , separator);
	let iMonth = outputIslamicDate.slice(separator + 1);
	if (arg == 'month') {
		return iMonth;
	}
	else if (arg == 'day') {
		return iDate
	}
	else {
		return outputIslamicDate
	}
}

function checkEidDay() {
	let bool1 = false;
	let bool2 = false;
	let bool = false;
	bool1 = returnIslamicDate() == "10 Dhul Hijja" ? true : false;
	bool2 = returnIslamicDate() == "1 Shawwal" ? true : false;
	bool = bool1 || bool2 ? true : false;
	return bool;
}

function checkEidCountdown() {
	let bool1 = false;
	let bool2 = false;
	let bool = false;
	let iDate = returnIslamicDate('day');
	let iMonth = returnIslamicDate('month');
	bool1 = iDate <= 9 && iMonth == "Dhul Hijja" ? true : false;
	bool2 = String(iDate).slice(0,1) > 1 && iMonth == "Ramadan" ? true : false;
	bool = bool1 || bool2 ? true : false;
	return bool;
}

function displayRemainingDays() {
	let eidR = returnIslamicDate('month') == "Ramadan" ? 31 - returnIslamicDate('day') : 10 - returnIslamicDate('day');
	console.log(returnIslamicDate('month'))
	console.log(returnIslamicDate('day'))
	return eidR;
}

function displayEidName() {
	let eidName = document.getElementsByClassName('eidName');

	let eid = returnIslamicDate('month') == "Ramadan" || returnIslamicDate('month') == "Shawwal" ? "EID UL-FITRA" : "EID UL-ADHA";
	
	eidName[0].innerHTML = eid;
	eidName[1].innerHTML = eid;
}

function toggleEid() {
	let eidHTML = document.getElementById('eid');
	if (isEid == true) {
		eidHTML.classList.replace('hidden', 'active')
	}
	else {
		eidHTML.classList.replace('active', 'hidden')
	}
	
}

function toggleEidNotification() {
	let eidHTML = document.getElementById('eidNotice');
	let eidCounter = document.getElementById('remainingDays')
	if (isEidCounter == true) {
		eidHTML.classList.replace('hidden', 'active')
		eidCounter.innerHTML = displayRemainingDays();
	}
	else {
		eidHTML.classList.replace('active', 'hidden')
	}
	
}

function inputUpdate(id, input) {
    localStorage.setItem(id, input)
}

function updateInput(input) {
	let fileName = input.value.split('\\');
    localStorage.setItem(input.id, fileName[fileName.length -1]);
	input.nextSibling.value = fileName[fileName.length -1];
}

function getActiveNamaaz() {
    let activeNamaaz = document.getElementsByClassName('active')[0];
	if (activeNamaaz == undefined){
		return false;
	}
    return activeNamaaz;
}

function getActiveInfo() {
    let activeInfo = document.getElementsByClassName('focus')[0];
	if (activeInfo == undefined){
		activeInfo = document.getElementsByClassName('fLast')[0];
	}
	if (activeInfo == undefined){
		return false;
	}
    return activeInfo;
}

function checkNamaazTimer(namaaz, date) {
    let currentTime = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
    let namaazTime;
    if (namaaz.getAttribute('id') == 'fajr' || namaaz.getAttribute('id') == 'eid') {
        namaazTime = namaaz.getAttribute('data-type');
    }
    else{
		if(namaaz.getAttribute('id') != 'eidNotice') {
			namaazTime = add12Hours(namaaz.getAttribute('data-type'))
		}
		else {
			console.log(namaaz.getAttribute('id'))
			namaazTime = eidNamaazTime
		}
    }
    let timer = returnTimeDifference(currentTime , namaazTime)
    
	if (Number(timer) <= 0) {
		sEnable = true
        namaaz.classList.remove('active');
		if (namaaz.getAttribute('id') != 'eid') {
			namaaz.getElementsByClassName('cStart')[0].classList.replace('visible', 'hidden');
			namaaz.getElementsByClassName('cJamaat')[0].classList.replace('visible', 'hidden');
			namaaz.getElementsByClassName('nStart')[0].classList.replace('hidden', 'visible');
			namaaz.getElementsByClassName('nJamaat')[0].classList.replace('hidden', 'visible');
		}
		else {
			namaaz.lastElementChild.classList.remove('countdown');
			namaaz.lastElementChild.innerHTML = namaaz.getAttribute('data-type');
		}
		if (namaaz.getAttribute('id') == 'maghrib') {
			cIDate.innerHTML = islamicDate[1];
			isEid = checkEidDay();
			toggleEid();
			isEidCounter = checkEidCountdown();
			toggleEidNotification();
			checkJummah();
		}
		
    }
	else if (Number(timer) > 0 && Number(timer) < 46) {
		sEnable = false;
		if (namaaz.getAttribute('id') == 'eid') {
			console.log(namaaz)
			namaaz.lastElementChild.classList.add('countdown');
			namaaz.lastElementChild.innerHTML = timer;
		}
		else {
			namaaz.getElementsByClassName('cJamaat')[0].classList.add('countdown');
			namaaz.getElementsByClassName('cJamaat')[0].innerHTML = timer;
		}
	}
}

function checkInfoTimer(info, date) {
	let currentTime = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
	let infoTimer;
    if (info.firstElementChild.getAttribute('id') != 'zawaal') {
        infoTimer = info.firstElementChild.getAttribute('data-type');
    }
    else{
        infoTimer = add12Hours(info.firstElementChild.getAttribute('data-type'));
    }
	let timer = returnTimeDifference(currentTime , infoTimer);
	if (Number(timer) <= 0) {
		sEnable = true;
		if (info.firstElementChild.getAttribute('id') != 'zawaal') {
			info.setAttribute('class', 'infoItems');
		}
		else {
			let zSeconds = convertToSeconds(info.firstElementChild.getAttribute('data-type'));
			let zawaalTimer = returnTimeDifference(currentTime , add12Hours(convertToTime(zSeconds, 10)));
			if (Number(zawaalTimer) <= 0) {
				info.setAttribute('class', 'infoItems');
				info.firstElementChild.classList.remove('countdown');
				info.firstElementChild.innerHTML = info.firstElementChild.getAttribute('data-type');
				info.lastElementChild.innerHTML = 'Istiwa';
			}
			else if (Number(zawaalTimer) > 0 && Number(zawaalTimer) < 600) {
				info.firstElementChild.classList.add('countdown');
				info.firstElementChild.innerHTML = displayZawaalTime(zawaalTimer);
				info.lastElementChild.innerHTML = 'Zawaal in';
			}
		}
		
		updateFocus();
		if (info.getElementsByClassName('cXInfo')[0] != undefined ) {
			info.getElementsByClassName('cXInfo')[0].classList.replace('visible', 'hidden');
			info.getElementsByClassName('nXInfo')[0].classList.replace('hidden', 'visible');
		}
	}
	else if (Number(timer) > 0 && Number(timer) < 46 && info.firstElementChild.getAttribute('id') != 'zawaal') {
		sEnable = false;
		info.getElementsByClassName('cXInfo')[0].classList.add('countdown');
		info.getElementsByClassName('cXInfo')[0].innerHTML = timer;
	}
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
    h = formatTIME12H(h);
    s = checkTime(s);
    return h + ':' + m ;
}

function displayZawaalTime(seconds) {
	let m = Math.floor(seconds / 60);
    let s = seconds % 60;
	m = checkTime(m);
	s = checkTime(s);
	if (seconds <= 60) {
		return s;
	}
	return m + ':' + s ;
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
	let hours;
    let minutes;
    let ampm;
	let strTime;
	if (typeof(date) == 'object') {
		hours = date.getHours();
    	minutes = date.getMinutes();
    	ampm = hours >= 12 ? 12 :0;
		hours = hours % 12;
		hours = hours ? hours :ampm; // the hour '0' should be '12'
		hours = checkTime(hours);
		minutes = checkTime(minutes);
		strTime = hours + ':' + minutes;
	}
    else {
		hours = (Number(date) == 12) ? Number(date) : Number(date) - 12;
		hours = checkTime(hours);
		strTime = hours;
	}
    
    return strTime;
}

function checkJummah() {
	let day = writeDate();
	let jummah = document.getElementById('zohar').firstElementChild
	if (day == 'Thursday') {
		jummah.innerHTML = 'JUMMAH';
	}
	else {
		jummah.innerHTML = 'ZOHAR';
	}
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

function hideSlides() {
    let slideDiv = document.getElementById('imageSlides');

    slideDiv.style.left = '-100%';
    slideDiv.className = 'imageSlides imageHidden';

}

function showSlides(inc) {
    let slideDiv = document.getElementById('imageSlides');
	let imageSelection = document.getElementById('slideImageD'+inc).value

    slideDiv.style.backgroundImage = 'url(assets/images/' + imageSelection + ')';

    slideDiv.className = 'imageSlides imageVisible';
    slideDiv.style.left = '0%';
}

function incSequence() {
	if (sequence == document.getElementById('inputSlideCount').value) {
		sequence = 1;
	}
	else {
		sequence++;
	}
}


setInterval(() => {
    let d = new Date();
    let dHours = d.getHours();
    let dMinutes = d.getMinutes();
    let dSec = checkTime(d.getSeconds());
    let ampm = dHours >= 12 ? 'pm' : 'am';
    let activeNamaaz = getActiveNamaaz();
	let activeInfo = getActiveInfo();
	if (sEnable) {
		timer++;
	}

	
	if (timer == slideTimer) {
		showSlides(sequence);
		incSequence();
	}
	if (timer > (slideDuration + slideTimer) || sEnable == false) {
		hideSlides();
		timer = -3;
	}
	
    ctime.innerHTML = formatTIME12H(d);
	if (activeNamaaz != false) {
		checkNamaazTimer(activeNamaaz, d);
	}
	if (activeInfo != false) {
		checkInfoTimer(activeInfo, d);
	}
    cSec.innerHTML = dSec;
    cAMPM.innerHTML = ampm;
    if (dHours == 0 && dMinutes == 0 && dSec == 0) { location.reload(); }

}, 1000)