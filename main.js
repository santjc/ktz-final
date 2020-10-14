var heli;
var flyenemy = [];
var enemys = [];
var bomb = [];
var index = 0;
var gravity;
var roll, torque = 0;
var steering;
var isSteering = false;
var joy, shoot;


var heliSprite = [];
var flags = [];
var expSprite = [];
var bombSprite;
var zombieSprite = [];
var buildSprite = [];
var bombDeadCount = 0;
var scoreCount = 0;
var generateZombies = false;
var timerValue = 60;



function preload() {


    heliSprite[0] = loadImage("./assets/heli1.png");
    heliSprite[1] = loadImage("./assets/heli2.png");
    heliSprite[2] = loadImage("./assets/heli3.png");
    heliSprite[3] = loadImage("./assets/heli4.png");


    flags[0] = loadImage("./assets/crm-flag.png");
    flags[1] = loadImage("./assets/crm-sign.png");
    flags[3] = loadImage("./assets/build-2.png");
    flags[4] = loadImage("./assets/build-1.png");
    flags[2] = loadImage("./assets/floor.png");



    // buildSprite[1] = loadImage("./assets/build2.png");

    expSprite[0] = loadImage("./assets/explosion/exp1.png");
    expSprite[1] = loadImage("./assets/explosion/exp2.png");
    expSprite[2] = loadImage("./assets/explosion/exp3.png");
    expSprite[3] = loadImage("./assets/explosion/exp4.png");
    expSprite[4] = loadImage("./assets/explosion/exp5.png");
    expSprite[5] = loadImage("./assets/explosion/exp6.png");

    bombSprite = loadImage("./assets/bomb.png");


    zombieSprite[0] = loadImage("./assets/zom1.png");
    zombieSprite[1] = loadImage("./assets/zom2.png");
    zombieSprite[2] = loadImage("./assets/zom3.png");
    zombieSprite[3] = loadImage("./assets/zom4.png");

    flags[5] = loadImage("./assets/amc-logo-pixel.png");
    flags[6] = loadImage("./assets/amc-logo-nobg.png");

}


function setup() {
    if (windowWidth > 768) {
        createCanvas(800, 600);
    } else {
        createCanvas(windowWidth, windowHeight);
    }
    joy = new Joystick(width * 0.8, height - height / 5, height / 8);
    shoot = new Joystick(width * 0.8, height - height / 3, height / 10);

    for (i = 0; i < 8; i++) {
        flyenemy[i] = new Flyenemy(random(-1000, 0), random(0, height / 1.3));
    }

    for (var i = 0; i < 11; i++) {
        enemys[i] = new Enemy(random(width, width * 2));
    }
    setInterval(timeIt, 1000);
    angleMode(DEGREES);
    heli = new Helicopter();
}


function draw() {

    background(0);


    if (timerValue > 55) {
        imageMode(CENTER);
        image(flags[5], width / 2, height / 2);
    } else {

        textSize(32);
        fill(255);
        textFont("VT323");
        textAlign(CENTER);
        fill(255);
        textSize(32);
        if (timerValue != 0 && heli.hp > 0) {
            text('KILL 10 ZOMBIES IN TIME', width / 2, height * 0.05);

            text('SCORE: ' + scoreCount, width / 2, height / 4 + 30);
            text('HP: ' + heli.hp, 50, 150);
        }



        if (timerValue > 50) {
            if (windowWidth > 768) {
                text("Tecla: S -> Bomba", width / 2, 150);
            } else {
                text("Shoot", width * 0.8, height * 0.6);
            }
            strokeWeight(0);
            push();
            fill(255, 0, 0);
            text("Move", width * 0.8, height * 0.9);
            pop();

        }





        imageMode(CENTER);
        image(flags[2], width / 2, height - 20);
        image(flags[3], 350, height - 160);
        image(flags[3], 25, height - 160);
        image(flags[4], 160, height - 110);
        image(flags[0], width / 3, height - 48);
        image(flags[1], width / 2, height - 48);

        joy.update();
        joy.render();
        if (windowWidth < 768) {

            shoot.render();
        }

        if (windowWidth < 768) {
            joy.update();
            joy.render();
            shoot.render();
        }




        heli.show(heliSprite);
        heli.animateSprite(0.4);
        heli.update();
        steering = createVector(roll, -torque);
        heli.addForce(steering);

        torque = -joy.getValue().y;
        roll = joy.getValue().x;


        heli.rotorAngle += steering.x * 3.5;

        for (i = 0; i < flyenemy.length; i++) {
            flyenemy[i].moveEnemy();
            if (flyenemy[i].hit(heli)) {
                flyenemy[i].destroy();
                heli.pos.x += random(-5, 5);
            }

            if (flyenemy[i].delete) {
                flyenemy[i].showSprite(expSprite);
                flyenemy[i].animateSprite(0.1);
                index += 0.2;
                if (index >= expSprite.length) {
                    flyenemy.splice(i, 1);
                    index = 0;
                }
            }
        }
        if (timerValue % 5 == 0) {
            generateZombies = true;
        }
        if (generateZombies == true && enemys.length != 0) {
            for (var i = 0; i < enemys.length / 2; i++) {
                enemys[i].show(zombieSprite);
                enemys[i].animateSprite(0.07);
                enemys[i].move();
            }
        }




        for (var i = 0; i < bomb.length; i++) {
            bomb[i].show(bombSprite);
            bomb[i].move(heli);
            if (bomb[i].y > height / 2) {
                for (var j = 0; j < enemys.length; j++) {
                    if (bomb[i].hit(enemys[j])) {

                        enemys[j].hp++;
                    }

                    if (enemys[j].dead) {
                        scoreCount++;
                        enemys.splice(j, 1);

                    }
                }
                if (bomb[i].y > height - 35) {
                    bomb[i].destroy();
                }


                if (bomb[i].delete) {
                    bombDeadCount++;
                    bomb[i].showSprite(expSprite);
                    bomb[i].animateSprite(0.2);
                    index += 0.2;
                    if (index >= expSprite.length) {
                        bomb.splice(i, 1);
                        index = 0;
                    }
                }
            }
        }




        textAlign(CENTER);
        strokeWeight(0);
        if (heli.hp > 0) {
            if (timerValue >= 10) {
                fill(255);
                text("0:" + timerValue, width / 2, height / 2);
            }
            if (timerValue < 10) {
                text('0:0' + timerValue, width / 2, height / 2);
            }
        }
        if (timerValue == 0 || heli.hp == 0) {
            imageMode(CENTER);
            image(flags[6], width / 2, height / 3);
            text('GAME OVER', width / 2, height / 2 + 64);
            enemys.splice(0, enemys.length);
            flyenemy.splice(0, flyenemy.length);
        }

        if (timerValue == 0 && scoreCount < 10) {
            text("You failed", width / 2, height / 2 + 128);
        }

        if (heli.hp <= 0) {
            text("You failed", width / 2, height / 2 + 128);
            enemys.splice(0, enemys.length);
            flyenemy.splice(0, flyenemy.length);
        }

        if (timerValue == 0 && scoreCount >= 10) {
            text("YOU WIN!", width / 2, height / 2 + 128);
        }
    }
}




function timeIt() {
    if (timerValue > 0) {
        timerValue--;
    }
}


function keyPressed() {
    if (key === "s") {
        var bullet = new Bullet(heli.pos.x, heli.pos.y);
        if (bomb.length == 0) {
            bomb.push(bullet);
        }

    }

    // if (key === "q") {
    //     timerValue = 5;
    // }
}

function touchStarted() {
    joy.activateJoystick(true);
    shoot.activateJoystick(true);

    if (shoot.ctrl == true) {
        var bullet = new Bullet(heli.pos.x, heli.pos.y);
        if (bomb.length == 0) {
            bomb.push(bullet);
        }
    }
    return false;
}

function mousePressed() {
    joy.activateJoystick(true);
    shoot.activateJoystick(true);

    if (shoot.ctrl == true) {
        var bullet = new Bullet(heli.pos.x, heli.pos.y);
        if (bomb.length == 0) {
            bomb.push(bullet);
        }
    }
}

function mouseReleased() {
    joy.activateJoystick(false);
    shoot.activateJoystick(false);
}


function touchEnded() {
    joy.activateJoystick(false);
    shoot.activateJoystick(false);
    return false;
}