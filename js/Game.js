import Player from './Player.js';
import Platform from './Platform.js';
import * as constants from './Constants.js';

let levelID = parseInt(localStorage.getItem('selectedLevelId'));
let levelAmount = parseInt(localStorage.getItem('levelAmount'));

let sketch = (level) => {
    let player;
    let gamma = 0;
    let cameraY = 0;
    let platforms = [];
    let currentLevel;
    let playerImage;
    let platformImage;
    let themeColor = 200;

    level.preload = () => {
        level.loadJSON('../levels.json', (data) => {
            if (levelAmount === 0) {
                levelAmount = data.levels.length;
                localStorage.setItem('levelAmount', levelAmount);
            }
            let plats = [];
            level.setLevelTheme(data.levels[levelID - 1].area);
            plats = level.initPlatforms(data);

            currentLevel = { id: data.levels[levelID - 1].id, area: data.levels[levelID - 1].area, platforms: plats };
            playerImage = level.loadImage('../images/jumping_monkey.png');
            console.log(currentLevel);
        });
    };

    level.setup = () => {
        let canvas = level.createCanvas(level.windowWidth, level.windowHeight);
        localStorage.setItem(`level${levelID}Available`, 'true');
        localStorage.setItem('selectedLevelId', levelID);
        canvas.parent('canvas-container');
        level.windowResized();
        player = new Player(level.width / 2 - 25, level.height - 50, constants.PLAYER_WIDTH, constants.PLAYER_HEIGHT, playerImage);
        platforms = currentLevel.platforms;

        if (window.DeviceOrientationEvent) {
            window.addEventListener('deviceorientation', function (event) {
                gamma = event.gamma; // rotation around y-axis
            });
        } else {
            console.log('DeviceOrientationEvent is not supported');
        }
        console.log('// INIT OVER //');
    };

    level.draw = () => {
        level.translate(0, -cameraY);
        level.background(themeColor);
        level.handlePlayer();
        level.handlePlatforms();
        level.checkWinLoseCondition();

        if (gamma === null) gamma = 0;
        document.getElementById('gammaDebug').textContent = 'gamma: ' + gamma.toFixed(3);
    };

    level.windowResized = () => {
        let containerWidth = level.select('#canvas-container').width;
        level.resizeCanvas(containerWidth, level.windowHeight);
        level.background(themeColor);
    };

    level.handlePlayer = () => {
        player.draw(level);
        player.jump(level);
        player.input(level, gamma);
        if (player.y < cameraY + level.height / 2) {
            cameraY = player.y - level.height / 2;
        }
    };

    level.checkWinLoseCondition = () => {
        if (player.y > cameraY + level.height) {
            // Game over
            let gameOverModal = new bootstrap.Modal(document.getElementById('gameOverModal'));
            document.getElementById('gameOverModalLabel').textContent = 'Game Over';
            document.getElementById('ModalText').textContent = 'Your game is over. Play again?';

            gameOverModal.show();
            player.dead = true;
            level.noLoop();
        } else if (platforms[0].finish && player.finished) {
            // Level finished
            let gameOverModal = new bootstrap.Modal(document.getElementById('gameOverModal'));
            document.getElementById('gameOverModalLabel').textContent = 'Level Finished';
            document.getElementById('ModalText').textContent = 'Congrats you Won!';
            gameOverModal.show();
            levelID++;
            level.noLoop();
        }
    };

    level.handlePlatforms = () => {
        for (let platform of platforms) {
            platform.draw(level);
            let destroy = platform.checkCollision(player, level);
            if (destroy === true) platforms.pop();
        }
    };

    level.setLevelTheme = (area) => {
        switch (area) {
            case 'hell':
                platformImage = level.loadImage('../images/platforms/hell_platform.png');
                themeColor = level.color(87, 38, 39);
                break;
            case 'dirt':
                platformImage = level.loadImage('../images/platforms/ground_platform.png');
                themeColor = level.color(101, 69, 50);

                break;
            case 'rock':
                platformImage = level.loadImage('../images/platforms/mountain_platform.png');
                themeColor = level.color(75, 79, 116);

                break;
            case 'sky':
                platformImage = level.loadImage('../images/platforms/sky_platform.png');
                themeColor = level.color(10, 169, 216);

                break;
            case 'space':
                platformImage = level.loadImage('../images/platforms/space_platform.png');
                themeColor = level.color(32, 33, 43);

            default:
                break;
        }
    };

    level.initPlatforms = (data) => {
        let plats = [];
        for (let platformData of data.levels[levelID - 1].platforms) {
            let platform = new Platform(
                platformData.x,
                platformData.y,
                platformData.width,
                platformData.height,
                platformData.finish,
                platformData.stable,
                platformImage
            );
            console.log(platform);
            plats.push(platform);
        }
        return plats;
    };
};

document.getElementById('playAgainButton').addEventListener('click', function () {
    let gameOverModalElement = document.getElementById('gameOverModal');
    let gameOverModal = bootstrap.Modal.getInstance(gameOverModalElement);
    if (levelID > levelAmount) {
        window.location.href = '../index.html';
    } else {
        currentLevel.remove();
        currentLevel = new p5(sketch);
    }
    gameOverModal.hide();
});

let currentLevel = new p5(sketch);
console.log('LEVEL ID: [ ' + levelID + ' ]');
