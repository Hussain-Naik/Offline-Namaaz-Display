const iDayNames = new Array("sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday");

window.onload = () => {
    loopMonths(0);
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
    })

    nextMonth.addEventListener('click', function() {
        let incMonth = Number(month.getAttribute('data-type')) > 10 ? 0 : Number(month.getAttribute('data-type')) + 1
        month.setAttribute('data-type', incMonth);
        month.innerHTML = monthNames[incMonth];
        resetCalendar();
        loopMonths(incMonth);
        
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
            insert.classList.add('available');
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

function fillRemainingCalendar() {
    let fistCalendarItem = document.getElementsByClassName('card dates available week1')[0];
    let offset = iDayNames.indexOf(fistCalendarItem.parentElement.id) + 2;
    for (;offset > 0; offset--){
        console.log(offset)
    }
}

function resetCalendar() {
    let calendarItems = document.getElementsByClassName('dates');
    for (let i = 0; i < calendarItems.length; i++) {
        calendarItems[i].innerHTML = '';
        calendarItems[i].setAttribute('class', 'card dates week month')
    }
}