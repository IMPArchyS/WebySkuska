export default class Platform {
    constructor(x, y, width, height, finish) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.finish = finish;
    }

    draw(level, MAX_WIDTH, MIN_WIDTH) {
        let actualX = this.x * level.width;
        let actualY = this.y * level.height;
        let actualWidth = Math.min(Math.max(this.width * level.width, MIN_WIDTH), MAX_WIDTH);
        let actualHeight = this.height * level.height;
        if (this.finish) {
            level.fill(0, 255, 255);
        } else {
            level.fill(255, 150, 100);
        }
        level.rect(actualX, actualY, actualWidth, actualHeight);
    }

    checkCollision(player, levelWidth, levelHeight, cameraY) {
        let playerBottom = player.y + player.height + cameraY;
        let platformTop = this.y * levelHeight + cameraY;
        let platformBottom = (this.y + this.height) * levelHeight + cameraY;
        let playerRight = player.x + player.width;
        let platformLeft = this.x * levelWidth;
        let platformRight = (this.x + this.width) * levelWidth;

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

            if (this.finish) {
                console.log('Level finished!');
                player.finished = true;
            }
        }
    }
}
