const iDayNames = new Array("sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday");
const FridayOffset = new Array(2, 3, 4, 5, 6, 0, 1);
const AfterOffset = new Array(4, 3, 2, 1, 0, 6, 5);
const NamaazData = JSON.parse(localStorage.getItem('NamaazData'));
const currentYear = new Date().getFullYear();

window.onload = () => {
    loopMonths(0);
    calendarBefore();
    calendarAfter();
    populateDataInput();
    var reader = new FileReader(),
        picker = document.getElementById("picker");

    picker.onchange = () => reader.readAsText(picker.files[0]);

    reader.onloadend = () => {
        const data = {};
        let csv = reader.result;
        let map = ['Date', 'Sehri End', 'Fajr Start', 'Fajr Jamaat', 'Sunrise', 'Zohar Start', 'Zohar Jamaat', 'Asar Start', 'Asar Jamaat', 'Maghrib Start', 'Maghrib Jamaat', 'Isha Start', 'Isha Jamaat']
        let array = csv.split(/[\r\n]+/g);
        array.forEach(element => {
          element = element.split(',');
          let lineData = {}
          for (let i = 0; i < element.length ; i ++) {
            lineData[map[i]] = element[i];
          }
          data[element[0]] = lineData;
        });
        localStorage.setItem('NamaazData', JSON.stringify(data))
    }

}

document.addEventListener("DOMContentLoaded", function() {
    let previousMonth = document.getElementById('prevousM');
    let nextMonth = document.getElementById('nextM');
    let month = document.getElementById('currentM');
    let selection = document.getElementById('select');
    let monthNames = new Array("January", "February", "March", "April",
		"May", "June", "July", "August",
		"September", "October", "November", "December");

    previousMonth.addEventListener('click', function() {
        let incMonth = Number(month.getAttribute('data-type')) < 1 ? 11 : Number(month.getAttribute('data-type')) - 1
        month.setAttribute('data-type', incMonth);
        month.innerHTML = monthNames[incMonth];
        resetCalendar();
        loopMonths(incMonth);
        calendarBefore();
        calendarAfter();
    })

    nextMonth.addEventListener('click', function() {
        let incMonth = Number(month.getAttribute('data-type')) > 10 ? 0 : Number(month.getAttribute('data-type')) + 1
        month.setAttribute('data-type', incMonth);
        month.innerHTML = monthNames[incMonth];
        resetCalendar();
        loopMonths(incMonth);
        calendarBefore();
        calendarAfter();
        
    })

    selection.addEventListener('click', function() {
        let child = selection.getElementsByClassName('visible')[0];
        child.classList.replace('visible', 'hidden');
        if (child.nextElementSibling == null) {
            child.parentElement.firstElementChild.classList.replace('hidden', 'visible');
        }
        else {
            child.nextElementSibling.classList.replace('hidden', 'visible');
        }
        
        
    })
});

function loopMonths(month) {
    let currentDate = new Date();
    let m = month + 1;
    let d = 1;
    let inc = 1;
    let loopDate = new Date(currentDate.getFullYear() + '/' + m + '/' + d);
    while (d <= 31) {
        loopDate = new Date(currentDate.getFullYear() + '/' + m + '/' + d);
        let insert = document.getElementById(iDayNames[loopDate.getDay()]).getElementsByClassName('card')[inc];
        
        if (Number(loopDate.getMonth()) <= month) {
            insert.innerHTML = d;
            insert.classList.replace('hidden', 'current');
            insert.classList.add('week');
            insert.classList.add('month');
            insert.classList.replace('week', 'week' + inc);
            insert.classList.replace('month', 'month' + month);
        }
        if (loopDate.getDay() == 4) {
            inc++;
        }
        d++;
    }
}

function calendarBefore() {
    let fistCalendarItem = document.getElementsByClassName('card dates current week1')[0];
    let offset = Number(fistCalendarItem.parentElement.getAttribute('data-offset'));
    let m = document.getElementById('currentM').getAttribute('data-type');
    let y = new Date().getFullYear();
    let dateString = y + '/' + (Number(m)+1) +'/01';
    let offsetParent = fistCalendarItem.parentElement;
    for (let i = 1;i < offset + 1; i++){
        offsetParent = offsetParent.previousElementSibling;
        offsetParent.children[1].innerHTML = getOffsetDateD(dateString, -i)
        offsetParent.children[1].classList.replace('hidden', 'available');
        offsetParent.children[1].classList.add('week1');
    }
}
function calendarAfter() {
    let indexLast = document.getElementById('friday').getElementsByClassName('current').length - 1;
    let lastCalItem = document.getElementById('friday').getElementsByClassName('current')[indexLast];
    let indexChildren = Number(lastCalItem.getAttribute('data-child'));
    let offsetParent = lastCalItem.parentElement;
    let dateInc = 1;
    for (let i = 0; i < 6; i++) {
        offsetParent = offsetParent.nextElementSibling;
        if (offsetParent.children[indexChildren].classList.length == 3){
            offsetParent.children[indexChildren].innerHTML = dateInc;
            offsetParent.children[indexChildren].classList.replace('hidden', 'available');
            offsetParent.children[indexChildren].classList.add('week'+ indexChildren);
            dateInc++
        }
    }
}

function getDateByOffset(start, offset) {
	var date = new Date(start || Date.now());
	var n = Number(offset);

	if (n !== n || date.toString() == "Invalid Date") { return date; }

	date.setDate(date.getDate() + n);
  return date;
}

function getOffsetDateD(start, offset) {
    let date = getDateByOffset(start, offset);
    let d = date.getDate();
	let dateString = d;
  return dateString;
}

function getOffsetDateDM(start, offset) {
    let date = getDateByOffset(start, offset);
    let d = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
	let m = (date.getMonth() + 1);
	m = m < 10 ? '0' + m : m;
	let dateString = d + '/' + m;
  return dateString;

}
function resetCalendar() {
    let calendarItems = document.getElementsByClassName('dates');
    for (let i = 0; i < calendarItems.length; i++) {
        calendarItems[i].innerHTML = '';
        calendarItems[i].setAttribute('class', 'card dates hidden')
    }
}

function populateDataInput() {
    let html = document.getElementById('data');
    for (let i = 1; i < 367; i++){
        let valueInc = getOffsetDateDM('2023/01/01', i);
        if(valueInc == '01/01') {
            break
        }
        else {
            let insert = document.createElement('div');
            insert.innerHTML = `
            <input id="Date" type="text" disabled value="`+ valueInc +`">
            <input id="Sehri End" type="time">
            <input id="Fajr Start" type="time">
            <input id="Fajr Jamaat" type="time">
            <input id="Sunrise" type="time">
            <input id="Zohar Start" type="time">
            <input id="Zohar Jamaat" type="time">
            <input id="Asar Start" type="time">
            <input id="Asar Jamaat" type="time">
            <input id="Maghrib Start" type="time">
            <input id="Maghrib Jamaat" type="time">
            <input id="Isha Start" type="time">
            <input id="Isha Jamaat" type="time">`;
            insert.setAttribute('id', valueInc);
            insert.setAttribute('class', 'dRow');
            html.appendChild(insert);
        }
    }
    populateLoopDataInput();
    populateData();
}

function populateLoopDataInput() {
    let pDate = new Date(currentYear +'/01/01')
    let aDate = new Date(currentYear +'/12/31')
    let html = document.getElementById('data');
    
    let countP = FridayOffset[pDate.getDay()];
    let countA = AfterOffset[aDate.getDay()];
    for (let i = 0;i < countP ; i++){
        let x = (i + 1)* -1;
        let valueInc = getOffsetDateDM('2023/01/01', x);
        let insert = document.createElement('div');
        insert.innerHTML = `
            <input id="Date" type="text" disabled value="`+ valueInc +`">
            <input id="Sehri End" type="time">
            <input id="Fajr Start" type="time">
            <input id="Fajr Jamaat" type="time">
            <input id="Sunrise" type="time">
            <input id="Zohar Start" type="time">
            <input id="Zohar Jamaat" type="time">
            <input id="Asar Start" type="time">
            <input id="Asar Jamaat" type="time">
            <input id="Maghrib Start" type="time">
            <input id="Maghrib Jamaat" type="time">
            <input id="Isha Start" type="time">
            <input id="Isha Jamaat" type="time">`;
            insert.setAttribute('id', valueInc);
            insert.setAttribute('class', 'dRow');
        html.insertBefore(insert, html.children[0])
    }
    for (let y = 1; y < countA +1; y++) {
        let valueInc = getOffsetDateDM('2023/12/31', y);
        let insert = document.createElement('div');
        insert.innerHTML = `
            <input id="Date" type="text" disabled value="`+ valueInc +`">
            <input id="Sehri End" type="time">
            <input id="Fajr Start" type="time">
            <input id="Fajr Jamaat" type="time">
            <input id="Sunrise" type="time">
            <input id="Zohar Start" type="time">
            <input id="Zohar Jamaat" type="time">
            <input id="Asar Start" type="time">
            <input id="Asar Jamaat" type="time">
            <input id="Maghrib Start" type="time">
            <input id="Maghrib Jamaat" type="time">
            <input id="Isha Start" type="time">
            <input id="Isha Jamaat" type="time">`;
            insert.setAttribute('id', valueInc);
            insert.setAttribute('class', 'dRow');
            html.appendChild(insert);
    }
}


function populateData() {
    let data = document.getElementById('data').children;
    for (let i = 0; i < data.length; i++){
        let pDate = data[i].id + '/' + currentYear;
        let inputs = data[i].querySelectorAll('input');
        for (let input of inputs) {
            if (input.id != 'Date') {
                input.value = NamaazData[pDate][input.id];
            }
        }
    }
}