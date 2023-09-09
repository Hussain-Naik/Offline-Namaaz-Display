window.onload = () => {
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