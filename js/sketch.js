var lp;

// ---- Images -----
var image_stevy;
// --- Sounds ---
var sound_collisionfood;
var sound_gameover;

function preload() {
    image_stevy = loadImage('assets/images/stevy.png');
    sound_collisionfood = loadSound('assets/sounds/targetCollision.mp3');
    sound_gameover = loadSound('assets/sounds/fuckyeah.mp3');
    sound_e = loadSound('assets/sounds/e.ogg');
}

function setup() {
    var canvas = createCanvas(400, 400);

    canvas.parent('snake-Container');
    background(100);

    frameRate(20);

    lp  = new SneakySnake();
    food = new Target();
}

function keyPressed() {
    switch(keyCode) {
        case UP_ARROW:
            lp.speed(0, lp.speed_y == 1 ? 1 : -1);
            break;
        case DOWN_ARROW:
            lp.speed(0, lp.speed_y == -1 ? -1 : 1);
            break;
        case LEFT_ARROW:
            lp.speed(lp.speed_x == 1 ? 1 : -1, 0);
            break;
        case RIGHT_ARROW:
            lp.speed(lp.speed_x == -1 ? -1 : 1, 0);
            break;
    }
}

function draw() {
    background(100);

    if(lp.state == "alive"){
        lp.update();
        lp.render();
    }
    
    
    
    food.render();
    food.collision();
}

function Target() {
    this.x = int(random(1, 40)) * 10;
    this.y = int(random(1, 40)) * 10;

    this.render = function() {
        image(image_stevy, this.x, this.y, 12, 12);
    }

    this.regen = function() {
        this.x = int(random(1, 40)) * 10;
        this.y = int(random(1, 40)) * 10;
    }

    this.collision = function() {
        if(lp.x == this.x && lp.y == this.y) {
            lp.grow();
            this.regen();
            sound_collisionfood.play();
        }
        
    }
}

function SneakySnake() {
    this.x = 0;
    this.y = 0;

    this.state = "alive";

    this.tail = [];
    //this.size = 0;

    this.speed_x = 1;
    this.speed_y = 0;

    this.speed = function(xspeed, yspeed) {
        this.speed_x = xspeed;
        this.speed_y = yspeed;
    }

    this.update = function() {
        this.x = this.x + this.speed_x * 10;
        this.y = this.y + this.speed_y * 10;

        this.x = constrain(this.x, 0, 400-10);
        this.y = constrain(this.y, 0, 400-10);
    }

    this.grow = function() {
        this.tail.unshift(createVector(this.x, this.y));
    }

    this.render = function() {
        fill(600);
        rect(this.x, this.y, 10, 10);
        lp.collision();
        
        this.tail.forEach(part => rect(part.x, part.y, 10, 10));
        this.tail.unshift(createVector(this.x, this.y));
        this.tail.pop();
    }

    this.collision = function() {
        this.tail.forEach(part => {
            if(part.x == this.x && part.y == this.y) { 
            console.log("Gameover");
            sound_e.play();
            sound_gameover.play();
            $('#snakeheader,#g1,#g2').effect("shake", {times:25});
            this.state = "dead";
        }
        });
    }
}