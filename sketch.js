var lp;
var lt;

var sound_collisionTarget;
var sound_Gameover;

var gachiTarget;

var players = [];
var onlinePlayers = [];

function preload() {
    // -- Sounds
    sound_collisionTarget = loadSound('assets/sounds/targetCollision.mp3');
    sound_Gameover = loadSound('assets/sounds/fuckyeah.mp3');

    // -- Images
    gachiTarget = loadImage("assets/images/gachigasm-transparent-3.png")

    //--
    players.unshift(new Snake(20, 20));
    //players.push(new Snake(100, 100));
    lt = new Target();
}

function setup() {
    var canvas = createCanvas(400, 400);
    canvas.parent('snake-container');
    background(100);

    frameRate(10);
   
}

function draw() {
    background(100);
    players.forEach(player => {
        if(player.state != "Dead"){
            player.update();
            player.render();
            lt.render();
        }
        
    })
    
    
    

    drawGrid(10)
}

// -- Game Interactions --


// -- Key Interaction --

function keyPressed() {
    switch(keyCode) {
        case UP_ARROW:
            players[0].speed(0, players[0].speed_y == 1 ? 1 : -1);
            break;
        case DOWN_ARROW:
            players[0].speed(0, players[0].speed_y == -1 ? -1 : 1);
            break;
        case LEFT_ARROW:
            players[0].speed(players[0].speed_x == 1 ? 1 : -1, 0);
            break;
        case RIGHT_ARROW:
            players[0].speed(players[0].speed_x == -1 ? -1 : 1, 0);
            break;
    }
}

// Terrain 

function drawGrid(s) {
    for (let i = 0; i*s < 400; i++) {
        stroke(0);
        strokeWeight(1)
        line(i*s, 0, i*s, 400);
        line(0, i*s, 400, i*s);
    }
}

function Target() {
    this.x = int(random(1, 40)) * 10;
    this.y = int(random(1, 40)) * 10;

    this.render = function() {
        //fill(255, 100, 100);
        //rect(this.x, this.y, 10, 10);
        image(gachiTarget, this.x, this.y, 10, 10);
        
        this.collision();
    }

    this.regen = function() {
        this.x = int(random(1, 40)) * 10;
        this.y = int(random(1, 40)) * 10;
    }

    this.collision = function() {
        if(players[0].x == this.x && players[0].y == this.y) {
            this.regen();
            sound_collisionTarget.play();
            players[0].grow();
        }
        
    }
    
}

// -- SNAKE OBJECT ---

function Snake(initial_x, initial_y) {
    this.x = initial_x;
    this.y = initial_y;
    this.speed_x = 1;
    this.speed_y = 0;
    this.state = "alive";

    this.tail = [createVector(this.x - 10, this.y)];

    this.grow = function() {
        this.tail.unshift(createVector(this.x, this.y));
        this.tail.unshift(createVector(this.x, this.y));
    }

    this.speed = function(xspeed, yspeed) {
        this.speed_x = xspeed;
        this.speed_y = yspeed;
    }

    this.update = function() {
        this.x = this.x + this.speed_x * 10;
        this.y = this.y + this.speed_y * 10;

        this.x = constrain(this.x, 0, width-10);
		this.y = constrain(this.y, 0, height-10);
    }

    this.collision = function() {
        this.tail.forEach(part => {
            if(part.x == this.x && part.y == this.y) {
                //sound_Gameover.play();
                $("#snakegasmTitle").effect("shake", {times:4});
                this.state = "Dead";
            }
        })
    }

    this.render = function() {
        fill(255);
        rect(this.x, this.y, 10, 10);
        this.collision();

        this.tail.forEach(part => rect(part.x, part.y, 10, 10));
        this.tail.unshift(createVector(this.x,this.y));
        this.tail.pop();
        
        
    }
}