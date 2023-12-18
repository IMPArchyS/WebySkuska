// Player.js
export default class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.yVelocity = 0;
        this.onGround = true;
    }

    jump(level, gravity) {
        this.yVelocity += gravity;

        this.y += this.yVelocity;

        if (this.y > level.height - 50) {
            this.y = level.height - 50;
            this.yVelocity = 0;
            this.onGround = true;
        }
    }

    input(level, constants, gamma) {
        if (level.keyIsDown(constants.KEY_A) || gamma < 0) {
            this.x -= 5;
            if (this.x + 50 < 0) {
                this.x = level.width;
            }
        } else if (level.keyIsDown(constants.KEY_D) || gamma > 0) {
            this.x += 5;

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
