import * as constants from './Constants.js';
export default class Platform {
    constructor(x, y, width, height, finish, stable, img) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.finish = finish;
        this.img = img;
        this.stable = stable;
        this.wasOnPlatform = false;
    }

    draw(level) {
        let actualX = this.x * level.width;
        let actualY = this.y * level.height;
        let actualWidth = Math.min(Math.max(this.width * level.width, constants.MIN_WIDTH), constants.MAX_WIDTH);
        let actualHeight = this.height * level.height;
        if (this.finish) {
            // level.fill(0, 255, 255);
            //level.tint(255, 0, 255);
            level.image(this.img, actualX, actualY, actualWidth, actualHeight);
            //level.noTint();
        } else {
            // level.fill(255, 150, 100);
            level.image(this.img, actualX, actualY, actualWidth, actualHeight);
        }
        // OLD PLATFORM DRAWING
        // level.rect(actualX, actualY, actualWidth, actualHeight);
    }

    checkCollision(player, level) {
        let playerBottom = player.y + player.height;
        let platformTop = this.y * level.height;
        let platformBottom = (this.y + this.height) * level.height;
        let playerRight = player.x + player.width;
        let platformLeft = this.x * level.width;
        let actualWidth = Math.min(Math.max(this.width * level.width, constants.MIN_WIDTH), constants.MAX_WIDTH);
        let platformRight = this.x * level.width + actualWidth;

        if (
            playerBottom > platformTop &&
            player.y < platformBottom &&
            playerRight > platformLeft &&
            player.x < platformRight &&
            playerBottom < platformTop + player.yVelocity
        ) {
            player.y = platformTop - player.height;
            player.yVelocity = 0;
            player.onGround = true;
            player.wasOnPlatform = true;

            if (this.finish) {
                console.log('PLATFORM COLLISION: Level finished!');
                player.finished = true;
                level.currentLevel++;
                level.highestLevel = Math.max(level.highestLevel, level.currentLevel);
            }
            if (this.stable === false) {
                console.log('PLATFORM COLLISION: UNSTABLE PLATFORM');
                return true;
            }
            return false;
        }
        return false;
    }
}
