import * as constants from './Constants.js';

export default class Player {
    constructor(x, y, width, height) {
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

        this.y += this.yVelocity;

        if (this.y > level.height - 50) {
            this.y = level.height - 50;
            this.yVelocity = 0;
            this.onGround = true;
        }
    }

    input(level, gamma) {
        if (this.dead || this.finished) return;

        let moveSpeed = level.width * 0.01; // 1% of screen width per frame

        if (level.keyIsDown(constants.KEY_A) || gamma < 0) {
            this.x -= moveSpeed;
            if (this.x + 50 < 0) {
                this.x = level.width;
            }
        } else if (level.keyIsDown(constants.KEY_D) || gamma > 0) {
            this.x += moveSpeed;

            if (this.x > level.width) {
                this.x = -50;
            }
        }
        if (this.onGround) {
            this.yVelocity = constants.jumpForce;
            this.onGround = false;
        }
    }
}
