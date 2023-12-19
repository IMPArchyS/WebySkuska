import * as constants from './Constants.js';
import Player from './Player.js';
import Platform from './Platform.js';

document.getElementById('playAgainButton').addEventListener('click', function () {
    location.reload();
});

let sketch = (level) => {
    let player;
    let gamma = 0;
    let cameraY = 0;
    let platforms = [];

    level.preload = () => {
        level.loadJSON('./levels.json', (data) => {
            let levelData = data.levels[0]; // Load the first level
            for (let platformData of levelData.platforms) {
                let platform = new Platform(platformData.x, platformData.y, platformData.width, platformData.height, platformData.finish);
                platforms.push(platform);
            }
        });
    };

    level.setup = () => {
        let canvas = level.createCanvas(level.windowWidth, level.windowHeight);
        canvas.parent('canvas-container');
        level.background(200);
        level.windowResized(); // Ensure correct canvas size at start
        player = new Player(level.width / 2 - 25, level.height - 50, 50, 50); // Create a new player object
        console.log('init');

        if (window.DeviceOrientationEvent) {
            window.addEventListener('deviceorientation', function (event) {
                gamma = event.gamma; // rotation around y-axis
            });
        } else {
            console.log('DeviceOrientationEvent is not supported');
        }
    };

    level.draw = () => {
        level.translate(0, -cameraY);
        level.background(200);
        level.handlePlayer();
        for (let platform of platforms) {
            platform.draw(level, constants.MAX_WIDTH, constants.MIN_WIDTH);
            platform.checkCollision(player, level.width, level.height, 0);
        }
        document.getElementById('gammaDebug').textContent = 'gamma: ' + gamma.toFixed(3);

        if (player.y > cameraY + level.height) {
            // Game over
            var gameOverModal = new bootstrap.Modal(document.getElementById('gameOverModal'));
            document.getElementById('gameOverModalLabel').textContent = 'Game Over';
            document.getElementById('ModalText').textContent = 'Your game is over. Play again?';
            gameOverModal.show();
            level.noLoop();
        } else if (platforms[0].finish && player.finished) {
            // Level finished
            var gameOverModal = new bootstrap.Modal(document.getElementById('gameOverModal'));
            document.getElementById('gameOverModalLabel').textContent = 'Level Finished';
            document.getElementById('ModalText').textContent = 'Congrats you Won!';
            gameOverModal.show();
            level.noLoop();
        }
    };

    level.windowResized = () => {
        let containerWidth = level.select('#canvas-container').width;
        level.resizeCanvas(containerWidth, level.windowHeight);
        level.background(200);
    };

    level.handlePlayer = () => {
        level.fill(255, 0, 0);
        level.rect(player.x, player.y, player.width, player.height);
        player.jump(level, constants.gravity);
        player.input(level, constants, gamma);
        if (player.y < cameraY + level.height / 2) {
            cameraY = player.y - level.height / 2;
        }
    };
};

new p5(sketch);
