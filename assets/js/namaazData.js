window.onload = () => {
    loopMonths(0);
    var reader = new FileReader(),
        picker = document.getElementById("picker");

    picker.onchange = () => reader.readAsText(picker.files[0]);

    reader.onloadend = () => {
        let csv = reader.result;
        let array = csv.split(/[\r\n]+/g);
        array.forEach(element => {
          element = element.split(',')
          console.log(element)
        });
        //console.log(array);
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
    let iDayNames = new Array("sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday");
    let currentDate = new Date();
    let m = month + 1;
    let d = 1;
    let inc = 1;
    let loopDate = new Date(currentDate.getFullYear() + '/' + m + '/' + d);
    while (d <= 31) {
        loopDate = new Date(currentDate.getFullYear() + '/' + m + '/' + d);
        let insert = document.getElementById(iDayNames[loopDate.getDay()]).getElementsByClassName('card')[inc];
        if (loopDate.getDay() == 0) {
            inc++;
        }
        if (Number(loopDate.getMonth()) <= month) {
            insert.innerHTML = d;
            insert.classList.add('available');
        }
        d++;
    }
}

function resetCalendar() {
    let calendarItems = document.getElementsByClassName('dates');
    for (let i = 0; i < calendarItems.length; i++) {
        calendarItems[i].innerHTML = '';
    }
}