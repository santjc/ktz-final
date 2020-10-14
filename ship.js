function Ship() {
    this.x = width / 2;
    this.y = 100;
    this.velocity = 0;
    this.s = 20;
    this.acc = 0;
    this.index = 0;
    this.angle = 0;


    this.setDir = function (dir) {
        this.velocity = dir;
        this.acc = 0.01 * dir;
    }

    this.setAngle = function (force) {
        if (this.velocity > 0) {
            this.angle += 0.008;
        }
        if (this.velocity < 0) {
            this.angle -= 0.008;
        }
        this.angle = constrain(this.angle, -0.15, 0.15);
        this.y -= this.angle * 2;
    }


    this.move = function () {
        this.velocity += this.acc;
        this.x += this.velocity;
        this.velocity = constrain(this.velocity, -3, 3);
        this.y = constrain(this.y, 100, 120);


        if (this.x + this.s > width) {
            this.x = width - this.s;
        } else if (this.x - this.s < 0) {
            this.x = 0 + this.s;
        }

        if(this.angle < 0.03){
            this.y -= 0.5;
        }else if(this.angle > 0){
            this.y += 0.5;
        }
    }

    this.show = function (animation) {
        push();
        var animLength = animation.length;
        translate(this.x, this.y);
        imageMode(CENTER);
        let index = floor(this.index) % animLength;
        rotate(this.angle);
        image(animation[index], 0, 0);
        pop();
    }
    this.animateSprite = function(speed){
        this.index += speed;

    }


}