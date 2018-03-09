document.addEventListener("DOMContentLoaded", function() {

    /****************
    CHANGE PARAMETERS IN ANIMATION
    *****************/
    var nrOfEyes = 30;


    //DOM ELEMENTS
    var canvas = document.querySelector('canvas');

    //GLOAL VARIABLES
    var ctx;
    var w;
    var h;


    /************
    EYE FUNCTIONS
    ************/
    function Point (x, y){
        this.x = x;
        this.y = y;
    }

    function Pupil(position, radius) {
        this.x = position.x;
        this.y = position.y;
        this.radius = radius;
    }

    function Eye() {
        this.x;
        this.y;
        this.radius = Math.round(Math.random() * 40 + 10);
        this.pupil;
        this.blink = false;
        this.blinkOpen = false;
        this.nrOfBlinks = 0;
        this.open = 0;
    }

    Eye.prototype.generatePosition = function() {
        // var emptySpacePercentageTop = 0.4;
        // var pOfYBeingInTheTopSection = 0.65;
        //
        // if(Math.random() < pOfYBeingInTheTopSection) {
        //     var y = Math.random() * h * emptySpacePercentageTop - h / 2;
        // } else {
        //     var y = Math.random() * h - h / 2;
        // }
        //
        // if(y > -h / 2 * (1 - emptySpacePercentageTop)) {
        //     var x = Math.random() * (w * 0.18 - 10) +  (w * (0.5 - 0.18) + 5);
        //
        //     if(Math.random() < 0.5) {
        //         x *= -1;
        //     }
        // } else {
        //     var x = Math.random() * w - w / 2;
        // }

        var x = Math.random() * w - w / 2;
        var y = Math.random() * h - h / 2;

        this.x =  x;
        this.y =  y;
        this.pupil = new Pupil(new Point(x, y), this.radius * 0.67);

    }

    Eye.prototype.drawEyeball = function() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 7);
        ctx.fillStyle = 'rgb(255, 255, 255)';
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
    }

    Eye.prototype.drawPupil = function(mousePos) {
        var dist = Math.sqrt(Math.pow(mousePos.x - this.x, 2) + Math.pow(mousePos.y - this.y, 2));
        var distRatio = Math.min(dist/60 * 5, this.pupil.radius);

        this.pupil.x = this.x + ((mousePos.x - this.x) * distRatio) / dist;
        this.pupil.y = this.y + ((mousePos.y - this.y) * distRatio) / dist;

        ctx.beginPath();
        ctx.arc(this.pupil.x, this.pupil.y, this.pupil.radius, 0, 7);
        ctx.fillStyle = 'black';
        ctx.fill();
        ctx.closePath();
    }

    Eye.prototype.openEye = function() {
        if(this.blink) {
                console.log('this.open ' + this.open);
            if(this.nrOfBlinks < 1) {
                //OPENING PROCESS
                if(this.blinkOpen) {
                    this.open += 0.09;
                    if(Math.pow(this.open, 2) >= 1) {
                        this.blinkOpen = false;
                    }
                }
                //CLOSING PROCESS
                else {
                    this.open -= 0.06;
                    if(this.open <= 0.6) {
                        this.blinkOpen = true;
                        this.nrOfBlinks += 1;
                    }
                }
            }




            var moveUp = Math.pow(this.open, 10) * this.radius;

            ctx.beginPath();
            ctx.moveTo(this.x - this.radius, this.y - this.radius - this.radius * 0.67 - moveUp);
            ctx.lineTo(this.x - this.radius, this.y + this.radius - this.radius / 2 - moveUp);
            ctx.quadraticCurveTo(
                this.x,
                this.y + this.radius + this.radius / 2 - moveUp - moveUp * 2,
                this.x + this.radius,
                this.y + this.radius - this.radius / 2 - moveUp
            );
            ctx.lineTo(this.x + this.radius, this.y - this.radius - this.radius * 0.67 - moveUp);
            ctx.closePath();
            ctx.fillStyle = 'black';
            ctx.fill();
        } else {
            this.blinkOpen = false;
            if(Math.pow(this.open, 10) <= 1) {
                this.open += 0.06;

                var moveUp = Math.pow(this.open, 10) * this.radius;

                ctx.beginPath();
                ctx.moveTo(this.x - this.radius, this.y - this.radius - this.radius * 0.67 - moveUp);
                ctx.lineTo(this.x - this.radius, this.y + this.radius - this.radius / 2 - moveUp);
                ctx.quadraticCurveTo(
                    this.x,
                    this.y + this.radius + this.radius / 2 - moveUp - Math.pow(this.open, 10) * this.radius * 2,
                    this.x + this.radius,
                    this.y + this.radius - this.radius / 2 - moveUp
                );
                ctx.lineTo(this.x + this.radius, this.y - this.radius - this.radius * 0.67 - moveUp);
                ctx.closePath();
                ctx.fillStyle = 'black';
                ctx.fill();
            }
        }

    }

    Eye.prototype.draw = function(mousePos) {

        // console.log('--------------');
        // console.log('START OF EYE.DRAW ');
        ctx.save();

        this.drawEyeball();

        ctx.clip();

        this.drawPupil(mousePos);

        //OPEN EYE
        this.openEye();

        ctx.restore();
        // console.log('END OF EYE.DRAW ');
        // console.log('---------------------');

    }

    Eye.prototype.isInside = function(thing) {
        if (thing.radius) {
            var radius = thing.radius;
        } else {
            var radius = 0;
        }

        if(thing.x - radius < this.x + this.radius &&
           thing.x + radius > this.x - this.radius &&
           thing.y - radius < this.y + this.radius &&
           thing.y + radius > this.y - this.radius
       ) {
           return true;
       } else {
           return false;
       }
    }


    /************
    ALL EYES ANIMATION
    ************/
    function EyeAnimation(nrOfEyes) {
        this.step = 0;
        this.eyeList =  [];
        this.openEyeList =  [];
        this.openEyeListLength = this.openEyeList.length;
        this.nrOfEyes = nrOfEyes;
        this.mousePosChanged = false;
        this.mousePos = new Point(0, 0);
    }

    EyeAnimation.prototype.checkIfEyesAreTooClose = function(eye) {

        var eyeListLength = this.eyeList.length;
        for(var i = 0; i < eyeListLength; i++) {
            if(this.eyeList[i].isInside(eye)) {
                   eye.generatePosition();
                   this.checkIfEyesAreTooClose(eye);
                   break;
            }
        }

        this.eyeList.push(eye);

    }

    EyeAnimation.prototype.generateEyes = function() {
        for(var i = 0; i < this.nrOfEyes; i++) {
            var eye = new Eye();
            eye.generatePosition();
            this.checkIfEyesAreTooClose(eye);
        }
    }

    EyeAnimation.prototype.animate = function() {
        var self = this;

        requestAnimationFrame(function() {
            self.animate();
        });

        if(this.openEyeList.length === 6) {
            setTimeout(function() {
                document.querySelector('main').classList.remove('invisible');
            }, 100);
        }

        if(this.openEyeListLength === this.nrOfEyes) {

            // if(mousePosChanged) {
                this.mousePosChanged = false;
                //clearCanvas(backgroundColor);

                for(var i = 0; i < this.nrOfEyes; i++) {
                    this.openEyeList[i].draw(this.mousePos);
                }


            //}
        } else {
            //should an eye open?
            if(Math.random() < Math.min(this.step, 0.4)) {
                this.openEyeList.push(this.eyeList[0]);
                this.openEyeListLength += 1;
                this.eyeList.shift();
            }

            for(var i = 0; i < this.openEyeList.length; i++) {
                this.openEyeList[i].draw(this.mousePos);
            }

            this.step += 0.0005;
        }
    }

    EyeAnimation.prototype.trackMouseMove = function() {
        var self = this;
        document.addEventListener('mousemove', function(evt) {

            self.mousePosChanged = true;
            self.mousePos = new Point(evt.clientX, evt.clientY);

            self.mousePos.x -= w/2;
            self.mousePos.y -= h/2;


            for(var i = 0; i < self.openEyeListLength; i++) {
                if(self.openEyeList[i].isInside(self.mousePos)) {
                    if(!self.openEyeList[i].blink) {
                        console.log('-------------------------------');
                    }

                    self.openEyeList[i].blink = true;
                } else {
                    self.openEyeList[i].blink = false;
                    self.openEyeList[i].nrOfBlinks = 0;
                }
            }
       }, false);
    }

    /************
    HOVER EFFECT
    ************/
    function HoverEffect() {
        this.hoverText = '';
        this.hoverTriggerList = document.querySelectorAll('.js-hover-trigger');
        this.hoverTriggerListLength = this.hoverTriggerList.length;
        this.hoverDisplay = document.querySelector('.js-hover-display');
        this.interval = 1000;
    }

    HoverEffect.prototype.init = function() {
        var self = this;
        for(var i = 0; i < this.hoverTriggerListLength; i++) {

            this.hoverTriggerList[i].addEventListener('mouseover', function(e) {

                if(!document.body.classList.contains('touch')) {
                    self.hoverDisplay.innerHTML = '';
                    self.hoverDisplay.classList.add('on');
                    self.hoverText = e.target.innerHTML;

                    self.interval = 1000;

                    self.animate();
                }
            })

            this.hoverTriggerList[i].addEventListener('mouseout', function(e) {
                self.hoverDisplay.classList.remove('on');
            })

        }
    }

    HoverEffect.prototype.animate = function() {

        this.interval -= 100;
        this.interval = Math.max(this.interval, 150);

        var hoverSpan = document.createElement('span');
        hoverSpan.innerHTML = this.hoverText;
        hoverSpan.style.top = Math.random() * window.innerHeight + 'px';
        hoverSpan.style.left = Math.random() * window.innerWidth + 'px';
        hoverSpan.style.transform = 'translateX(-50%) rotate(' + Math.random()*360 + 'deg)';
        this.hoverDisplay.appendChild(hoverSpan);


        if(this.hoverDisplay.classList.contains('on')) {
            var self = this;
            setTimeout(function() {
                self.animate();
            }, self.interval);
        }
    }

    /************
    SETUP CANVAS
    ************/
    function setupCanvas() {
        ctx = canvas.getContext('2d', {
          alpha: false
        });

         w = window.innerWidth;
         h = window.innerHeight;

         canvas.width = w;
         canvas.height = h;

         //set Point(0, 0) to be at the middle of the canvas
         ctx.translate(canvas.width / 2, canvas.height / 2);

         ctx.fillStyle = 'black';
         ctx.fillRect(-w/2, -h/2, w, h);
     }


    window.onresize = function() {
        setupCanvas();
    }


    function motion(event){
        var container = document.querySelector('.accelerometer');
        mousePos = new Point(event.accelerationIncludingGravity.x / 5 * w / 2, event.accelerationIncludingGravity.x / 5 * w / 2);
    }


    if(window.DeviceMotionEvent) {
      window.addEventListener("devicemotion", motion, false);
    }

//------------------------------------------------
    setupCanvas();
    var eyeAnimation = new EyeAnimation(nrOfEyes);
    eyeAnimation.generateEyes();
    eyeAnimation.animate();
    eyeAnimation.trackMouseMove();


    var hoverEffect = new HoverEffect();
    hoverEffect.init();


    document.addEventListener('click', function(evt) {


        var mousePos = new Point(evt.clientX, evt.clientY);

        mousePos.x -= w/2;
        mousePos.y -= h/2;

        document.querySelector('.console').innerHTML = mousePos.x + ', ' + mousePos.y;
   }, false);

})
