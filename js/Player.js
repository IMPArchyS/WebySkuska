import * as constants from './Constants.js';

export default class Player {
    constructor(x, y, width, height, img) {
        this.img = img;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.yVelocity = 0;
        this.onGround = true;
        this.finished = false;
        this.dead = false;
    }

    jump(level) {
        if (this.dead || this.finished) return;

        this.yVelocity += constants.gravity;

        this.y += this.yVelocity * (level.height * 0.001);

        if (this.y > level.height - this.height) {
            this.y = level.height - this.height;
            this.yVelocity = 0;
            this.onGround = true;
        }
    }

    resize(newWidth, newHeight) {
        this.width = newWidth;
        this.height = newHeight;
    }

    draw(level) {
        level.image(this.img, this.x, this.y, this.width, this.height);
    }

    input(level, gamma) {
        if (this.dead || this.finished) return;

        let gammaScale = 0.1;
        let moveSpeed = level.width * 0.01 + gamma * gammaScale; // 1% of screen width per frame

        // LEFT
        if (level.keyIsDown(constants.KEY_A) || level.keyIsDown(constants.LEFT_ARROW) || gamma < 0) {
            this.x -= moveSpeed;
            if (this.x + 50 < 0) {
                this.x = level.width;
            }
            // RIGHT
        } else if (level.keyIsDown(constants.KEY_D) || level.keyIsDown(constants.RIGHT_ARROW) || gamma > 0) {
            this.x += moveSpeed;

            if (this.x > level.width) {
                this.x = -50;
            }
        }
        // JUMP CHECK
        if (this.onGround) {
            this.yVelocity = constants.jumpForce;
            this.onGround = false;
        }
    }
}
