const canvas = document.querySelector('#myCanvas');
const ctx = canvas.getContext('2d');
canvas.width = canvas.width;
canvas.height = canvas.height;
const b_save = document.getElementById("b_save");

ctx.lineJoin = 'round';
ctx.lineCap = 'round';
ctx.lineWidth = 35;
ctx.strokeStyle = 'cornflowerblue';

let isDrawing = false;
let lastX = 0;
let lastY = 0;

function erase(){
    ctx.clearRect(0, 0, canvas.width, canvas.height)
}

function saveC(){
    var img = canvas.toDataURL("digit/png")
    var xhr = new XMLHttpRequest();
    var url = document.URL + "predict";
    var result = document.getElementById('result')

    xhr.onreadystatechange = function()
    {
      if(this.readyState == 4 && this.status == 200) {
        result.innerHTML = this.responseText;
      } else {
        result.innerHTML = "...";
      }
    }

    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    var data = JSON.stringify({"data": img});
    xhr.send(data);
    
    $('.collapse').collapse('show')
}

function closeB(){
  $('.collapse').collapse('hide');
  b_save.disabled = false;
  erase();
}

function draw(e) {
    // stop the function if they are not mouse down
    if(!isDrawing) return;
    //listen for mouse move event
    console.log(e);
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
    [lastX, lastY] = [e.offsetX, e.offsetY];
}

canvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
    [lastX, lastY] = [e.offsetX, e.offsetY];
});

canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', () => isDrawing = false);
canvas.addEventListener('mouseout', () => isDrawing = false);