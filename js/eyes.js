window.onload = function() {
    document.querySelector('main').classList.remove('invisible');
}

/****************
CHANGE PARAMETERS
*****************/

var backgroundColor = '#1d211e';

//CIRCLES
var nrOfEyes = 52;



/************
SETUP CANVAS
************/

var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d', {
  alpha: false
});

var w;
var h;
var pi = Math.PI;
var origo = new Point(0, 0);

var mousePos = new Point(0, 0);
var mousePosChanged = true;



setupCanvas();


/************
GEOMETRY
************/
function Point (x, y){
    this.x = x;
    this.y = y;
}


function Pupil(position, radius) {
    this.position = position;
    this.radius = radius;
}


function Eye(position, eyeR, pupilR) {
    this.position = position;
    this.radius = eyeR;
    this.pupil = new Pupil(new Point(position.x, position.y), pupilR);
}


Eye.prototype.draw = function(mousePos) {

    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.radius, 0, 7);
    ctx.fillStyle = 'rgb(150, 150, 150)';
    ctx.fill();
    ctx.stroke();
    ctx.closePath();


    var dist = Math.sqrt(Math.pow(mousePos.x - this.position.x, 2) + Math.pow(mousePos.y - this.position.y, 2));
    var distRatio = Math.min(dist/60 * 5, 5);


    this.pupil.position.x = this.position.x + ((mousePos.x - this.position.x) * distRatio) / dist;
    this.pupil.position.y = this.position.y + ((mousePos.y - this.position.y) * distRatio) / dist;



    // console.log('this.position.y ' + this.position.y);
    //
    // console.log('this.pupil.position.x ' + this.pupil.position.x);
    // console.log('this.pupil.position.y ' + this.pupil.position.y);


    ctx.beginPath();
    ctx.arc(this.pupil.position.x, this.pupil.position.y, this.pupil.radius, 0, 7);
    ctx.fillStyle = 'black';
    ctx.fill();
    ctx.closePath();


}

// Eye.prototype.blink() {
//
// }




var eyeList = [];


for(var i = 0; i < nrOfEyes; i++) {
    var eye = new Eye(new Point(Math.random() * w - w / 2, Math.random() * h - h / 2), 30, 20);
    console.log('eye '+  eye);
    eyeList.push(eye);
    eye.draw(mousePos);
}
draw();

/************
ACTION
************/

function clearCanvas(backgroundColor){
    c.fillStyle = backgroundColor;
    c.fillRect(-w/2, -h/2, w, h);
}


function draw() {
    requestAnimationFrame(draw);

    if(mousePosChanged) {
        mousePosChanged = false;
        //clearCanvas(backgroundColor);

        for(var i = 0; i < nrOfEyes; i++) {
            eyeList[i].draw(mousePos);
        }
    }
}


function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();

    return new Point(evt.clientX, evt.clientY);
};


function setupCanvas() {
     w = window.innerWidth;
     h = window.innerHeight;

     canvas.width = w;
     canvas.height = h;

     //set Point(0, 0) to be at the middle of the canvas
     ctx.translate(canvas.width / 2, canvas.height / 2);
 }


 document.addEventListener('mousemove', function(evt) {
     mousePosChanged = true;
     mousePos = getMousePos(canvas, evt);

     mousePos.x -= w/2;
     mousePos.y -= h/2;
}, false);


window.onresize = function() {
    setupCanvas()
}


function motion(event){
    var container = document.querySelector('.accelerometer');
    mousePos = new Point(event.accelerationIncludingGravity.x / 5 * w / 2, event.accelerationIncludingGravity.x / 5 * w / 2);
}


if(window.DeviceMotionEvent) {
  window.addEventListener("devicemotion", motion, false);
}
