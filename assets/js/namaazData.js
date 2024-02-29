const iDayNames = new Array("sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday");
const FridayOffset = new Array(2, 3, 4, 5, 6, 0, 1);
const AfterOffset = new Array(4, 3, 2, 1, 0, 6, 5);
const NamaazData = JSON.parse(localStorage.getItem('NamaazData'));
const currentYear = new Date().getFullYear();
const cMonth = new Date().getMonth();

window.onload = () => {
    calendar(cMonth);
    updateCalendar(cMonth);
    calendarBefore();
    calendarAfter();
    setCalendarTarget();
    populateDataInput();
    inputListeners()
    
    weekSelector()
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
    let month = document.getElementById('currentM');
    let nextMonth = document.getElementById('nextM');
    let selection = document.getElementById('select');
    
    

    previousMonth.addEventListener('click', function() {
        let incMonth = Number(month.getAttribute('data-type')) < 1 ? 11 : Number(month.getAttribute('data-type')) - 1
        updateCalendar(incMonth)
        resetCalendar();
        calendar(incMonth);
        calendarBefore();
        calendarAfter();
        setCalendarTarget();
        weekSelector()
    })

    nextMonth.addEventListener('click', function() {
        let incMonth = Number(month.getAttribute('data-type')) > 10 ? 0 : Number(month.getAttribute('data-type')) + 1
        updateCalendar(incMonth)
        resetCalendar();
        calendar(incMonth);
        calendarBefore();
        calendarAfter();
        setCalendarTarget();
        weekSelector()
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
        weekSelector()
        updateSelector()
    })

    
});
function updateCalendar(arg) {
    let month = document.getElementById('currentM');
    let monthNames = new Array("January", "February", "March", "April",
		"May", "June", "July", "August",
		"September", "October", "November", "December");
    month.setAttribute('data-type', arg);
    month.innerHTML = monthNames[arg];
}
function calendar(month) {
    let m = month + 1;
    let d = 1;
    let inc = 1;
    let loopDate = new Date(currentYear + '/' + m + '/' + d);
    while (d <= 31) {
        loopDate = new Date(currentYear + '/' + m + '/' + d);
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

function setCalendarTarget() {
    let items = document.getElementById('friday').getElementsByClassName('dates');
    for (let i = 0; i< items.length; i++) {
        let days = Number(items[i].innerHTML);
        let m = (items[i].classList[4] == undefined || items[i].classList[4] == 'selected')? Number(items[1].classList[4].slice(5)) : Number(items[i].classList[4].slice(5)) + 1;
        m = m == 0 ? 12: m;
        days = days < 10 ? '0' + days : days;
        m = m < 10 ? '0' + m : m;
        items[i].setAttribute('data-target', days +'/'+ m);
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
    let vDate = currentYear + '/01/01'
    for (let i = 1; i < 367; i++){
        let valueInc = getOffsetDateDM(vDate, i);
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
            insert.setAttribute('class', 'dRow hidden');
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
        let vDate = currentYear + '/01/01';
        let x = (i + 1)* -1;
        let valueInc = getOffsetDateDM(vDate, x);
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
            insert.setAttribute('class', 'dRow hidden');
        html.insertBefore(insert, html.children[0])
    }
    for (let y = 1; y < countA +1; y++) {
        let vDate = currentYear + '/12/31'
        let valueInc = getOffsetDateDM(vDate, y);
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
            insert.setAttribute('class', 'dRow hidden');
            html.appendChild(insert);
    }
}


function populateData() {
    let data = document.getElementById('data').children;
    let classSelection = '' ;
    for (let i = 0; i < data.length; i++){
        if (i % 7 == 0) {
            classSelection = (data[i].id);
        }
        data[i].classList.add(classSelection)
        let pDate = data[i].id;
        let inputs = data[i].querySelectorAll('input');
        for (let input of inputs) {
            if (input.id != 'Date') {
                input.value = NamaazData[pDate][input.id];
            }
        }
    }
}

function updateSelector() {
    let mCalendar = document.getElementById('calendarMonth')
    let dCalendar = document.getElementById('calendarDates')
    let sType = document.getElementById('select').getElementsByClassName('visible')[0].getAttribute('data-type');
    if (sType == 'all') {
        mCalendar.classList.add('hidden');
        dCalendar.classList.add('hidden');
    }
    else {
        mCalendar.classList.remove('hidden');
        dCalendar.classList.remove('hidden');
    }
}
function weekSelector(arg) {
    resetMonth()
    let sType = document.getElementById('select').getElementsByClassName('visible')[0].getAttribute('data-type');
    if (sType == 'week') {
        resetSelection()
        if (arg == undefined) {
            arg = document.getElementById('friday').children[1];
        }
        let selection = arg.classList[3];
        let nSelection = document.getElementsByClassName(selection);
        for (let nItem of nSelection) {
            nItem.classList.add('selected')
        }
        resetDataSelection()
        let dSelect = document.getElementsByClassName('selected')[0].getAttribute('data-target')
        let dataSelection = document.getElementsByClassName(dSelect);
        for (let dItem of dataSelection) {
            dItem.classList.replace('hidden', 'dActive')
        }
    }
    else if(sType == 'month') {
        monthSelector()
        resetDataSelection()
        let mSelectStart = document.getElementsByClassName('selected')[0].getAttribute('data-target')
        let mSelectRange = document.getElementsByClassName('selected').length
        let dStart = document.getElementById(mSelectStart);
        dStart.classList.replace('hidden', 'dActive')
        let temp = dStart.nextElementSibling;
        for (let i = 1; i < mSelectRange ; i++){
            temp.classList.replace('hidden', 'dActive');
            temp = temp.nextElementSibling
        }
    }
    else {
        resetDataSelection()
        selectAllData()
    }

}

function monthSelector() {
    let mSelect = document.getElementById('calendarDates').getElementsByClassName('current')
    let aSelect = document.getElementById('calendarDates').getElementsByClassName('available')
    for (let item of mSelect) {
        item.classList.add('selected')
    }
    for (let item of aSelect) {
        item.classList.add('selected')
    }
}

function resetMonth() {
    let pSelection = document.getElementById('calendarDates').getElementsByClassName('dates');
    for (let i = 0; i < pSelection.length; i++) {
        pSelection[i].classList.remove('selected')
    }
}

function resetSelection() {
    let pSelection = document.getElementById('calendarDates').getElementsByClassName('selected')[0];
    if (pSelection != undefined) {
        let selection = pSelection.classList[3];
        let rSelection = document.getElementsByClassName(selection);
        for (let nItem of rSelection) {
            nItem.classList.remove('selected')
        }
    } 
}

function resetDataSelection() {
    let dSelection = document.getElementById('data').querySelectorAll('div');
    for (let i = 0; i < dSelection.length; i++) {
        dSelection[i].classList.replace('dActive', 'hidden')
    }
}

function selectAllData() {
    let dSelection = document.getElementById('data').querySelectorAll('div');
    for (let i = 0; i < dSelection.length; i++) {
        dSelection[i].classList.replace('hidden', 'dActive')
    }
}

function inputListeners() {
    let dChildren = document.getElementById('data').children
    for (let dChild of dChildren) {
        let items = dChild.querySelectorAll('input')
        for (let item of items) {
            item.addEventListener('focusout', function() {
                let object = {};
                let date = this.parentElement.id
                let cItems = this.parentElement.children;
                for (let cItem of cItems) {
                    if(cItem.id == 'Date') {
                        object[cItem.id] = date
                    }
                    else {
                        object[cItem.id] = cItem.value
                    }
                    
                }
                NamaazData[date] = object
                localStorage.setItem('NamaazData', JSON.stringify(NamaazData))
            })
        }
    }
}