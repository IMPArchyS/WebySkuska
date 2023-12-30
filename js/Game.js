import Player from './Player.js';
import Platform from './Platform.js';
import * as constants from './Constants.js';

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
    let bgImage;
    let levelID;

    level.preload = () => {
        level.loadJSON('../levels.json', (data) => {
            if (levelAmount === 0) {
                levelAmount = data.levels.length;
                localStorage.setItem('levelAmount', levelAmount);
            }

            // Randomize the order of levels
            if (localStorage.getItem('levelOrder') === '0') {
                let levelOrder = data.levels.slice();
                levelOrder = shuffleLevels(levelOrder);
                let levelIds = '';
                for (let i = 0; i < levelOrder.length; i++) {
                    levelIds += levelOrder[i].id;
                    if (i < levelOrder.length - 1) {
                        levelIds += ',';
                    }
                }
                console.log('NEW LEVEL ORDER :');
                console.log(levelIds);
                localStorage.setItem('levelOrder', levelIds);
            }

            let levels = localStorage.getItem('levelOrder').split(',').map(Number);

            let selectedLevelId = parseInt(localStorage.getItem('selectedLevelId'));
            if (selectedLevelId > levelAmount) selectedLevelId = levelAmount;

            levelID = levels[selectedLevelId - 1];

            console.log('LEVEL ID: [ ' + levelID + ' ]');
            let plats = [];
            console.log(data.levels);
            level.setLevelTheme(data.levels[levelID - 1].area);
            plats = level.initPlatforms(data);

            currentLevel = { id: data.levels[levelID - 1].id, area: data.levels[levelID - 1].area, platforms: plats };
            playerImage = level.loadImage('../images/jumping_monkey.png');

            console.log('CURRENT LEVEL :');
            console.log(currentLevel);
            console.log('CURRENT LOCAL STORAGE :');
            console.log(localStorage);
        });

        function shuffleLevels(l) {
            for (let i = l.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [l[i], l[j]] = [l[j], l[i]];
            }
            return l;
        }
    };

    level.setup = () => {
        let canvas = level.createCanvas(level.windowWidth, level.windowHeight);
        canvas.parent('canvas-container');
        level.windowResized();
        player = new Player(
            level.width / 2 - 25,
            level.height,
            level.width * constants.PLAYER_WIDTH_RATIO,
            level.height * constants.PLAYER_HEIGHT_RATIO,
            playerImage
        );
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
        // Calculate the number of times the background image needs to be drawn
        let numImages = Math.ceil(level.height / bgImage.height) + 1;

        // Draw the background images
        for (let i = 0; i < numImages; i++) {
            // Adjust the y-coordinate of the image based on the camera position
            let y = i * bgImage.height - Math.abs(cameraY);
            level.tint(255, 127); // Set the tint color to white with 50% opacity
            level.image(bgImage, 0, y);
            level.noTint();
        }

        level.handlePlayer();
        level.handlePlatforms();
        level.checkWinLoseCondition();

        if (gamma === null) gamma = 0;
        //document.getElementById('gammaDebug').textContent = 'gamma: ' + gamma.toFixed(3);
    };

    level.windowResized = () => {
        let containerWidth = level.select('#canvas-container').width;
        level.resizeCanvas(containerWidth, level.windowHeight);
        if (player) player.resize(level.width * constants.PLAYER_WIDTH_RATIO, level.height * constants.PLAYER_HEIGHT_RATIO);
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
        // on ground and touched the first platform
        if (player.y + player.height >= level.height && player.wasOnPlatform === true) {
            console.log(player.y + player.height);
            console.log(level.height);
            console.log('LEVEL: hit ground after wasOnPlatform');
            player.dead = true;
        }

        if (player.y > cameraY + level.height || player.dead) {
            // Game over
            let gameOverModal = new bootstrap.Modal(document.getElementById('gameOverModal'));
            document.getElementById('resumeButton').style.display = 'none';
            document.getElementById('playAgainButton').style.display = 'block';
            document.getElementById('gameOverModalLabel').textContent = 'Game Over';
            document.getElementById('playAgainButton').textContent = 'Restart';
            document.getElementById('ModalText').textContent = 'Your game is over. Play again?';

            gameOverModal.show();
            player.dead = true;
            level.noLoop();
        } else if (platforms[0].finish && player.finished) {
            // Level finished
            let gameOverModal = new bootstrap.Modal(document.getElementById('gameOverModal'));
            document.getElementById('resumeButton').style.display = 'none';
            document.getElementById('playAgainButton').style.display = 'block';

            document.getElementById('gameOverModalLabel').textContent = 'Level Finished';
            document.getElementById('playAgainButton').textContent = 'Next Level';
            document.getElementById('ModalText').textContent = 'Congrats you Won!';
            gameOverModal.show();
            let levels = localStorage.getItem('levelOrder').split(',').map(Number);

            let selectedLevelId = parseInt(localStorage.getItem('selectedLevelId'));
            selectedLevelId++;
            localStorage.setItem('selectedLevelId', selectedLevelId);
            if (selectedLevelId > levelAmount) selectedLevelId = levelAmount;
            levelID = levels[selectedLevelId - 1];
            localStorage.setItem(`level${selectedLevelId}Available`, 'true');

            level.noLoop();
        }
    };

    level.handlePlatforms = () => {
        let destroy = false;
        let platformIndex = -1;
        for (let i = 0; i < platforms.length; i++) {
            const platform = platforms[i];
            platform.draw(level);
            destroy = platform.checkCollision(player, level);
            if (destroy === true) {
                platformIndex = i;
                break;
            }
        }
        if (platformIndex !== -1) {
            platforms.splice(platformIndex, 1);
        }
    };

    level.setLevelTheme = (area) => {
        switch (area) {
            case 'hell':
                platformImage = level.loadImage('../images/platforms/hell_platform.png');
                bgImage = level.loadImage('../images/backgrounds/svgs/hell1.svg');
                themeColor = level.color(87, 38, 39);
                break;
            case 'dirt':
                platformImage = level.loadImage('../images/platforms/ground_platform.png');
                bgImage = level.loadImage('../images/backgrounds/svgs/ground2.svg');

                themeColor = level.color(101, 69, 50);

                break;
            case 'rock':
                platformImage = level.loadImage('../images/platforms/mountain_platform.png');
                bgImage = level.loadImage('../images/backgrounds/svgs/mountains1.svg');

                themeColor = level.color(75, 79, 116);

                break;
            case 'sky':
                platformImage = level.loadImage('../images/platforms/sky_platform.png');
                bgImage = level.loadImage('../images/backgrounds/svgs/sky2.svg');

                themeColor = level.color(10, 169, 216);

                break;
            case 'space':
                platformImage = level.loadImage('../images/platforms/space_platform.png');
                bgImage = level.loadImage('../images/backgrounds/svgs/space1.svg');
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
            if (platform.finish === true) {
                platform.img = level.loadImage('../images/platforms/finish_platform.png');
            }
            plats.push(platform);
        }
        return plats;
    };
};

function restartGame() {
    let levelID = parseInt(localStorage.getItem('selectedLevelId'));
    console.log('RESTART LEVEL ID : ' + levelID);
    if (levelID > levelAmount) {
        window.location.href = '../index.html';
    } else {
        p5level.remove();
        p5level = new p5(sketch);
    }
}

document.addEventListener('keydown', function (event) {
    let gameOverModalElement = document.getElementById('gameOverModal');
    let gameOverModal = bootstrap.Modal.getInstance(gameOverModalElement);
    let modalOpen;
    if (gameOverModal === null) {
        modalOpen = false;
    } else {
        modalOpen = gameOverModal._isShown;
    }
    if ((event.key === 'r' || event.key === 'R') && !modalOpen) {
        restartGame();
    }
});

document.getElementById('playAgainButton').addEventListener('click', function () {
    let gameOverModalElement = document.getElementById('gameOverModal');
    let gameOverModal = bootstrap.Modal.getInstance(gameOverModalElement);
    let levelID = parseInt(localStorage.getItem('selectedLevelId'));
    if (document.getElementById('playAgainButton').textContent === 'Restart') {
        restartGame();
    } else {
        if (levelID > levelAmount) {
            window.location.href = '../index.html';
        } else {
            p5level.remove();
            p5level = new p5(sketch);
        }
    }
    gameOverModal.hide();
});

document.getElementById('resumeButton').addEventListener('click', function () {
    let gameOverModalElement = document.getElementById('gameOverModal');
    let gameOverModal = bootstrap.Modal.getInstance(gameOverModalElement);
    p5level.loop();
    gameOverModal.hide();
});

document.getElementById('mainMenuButton').addEventListener('click', function () {
    let gameOverModalElement = document.getElementById('gameOverModal');
    let gameOverModal = bootstrap.Modal.getInstance(gameOverModalElement);
    window.location.href = '../index.html';
    p5level.remove();
    p5level = new p5(sketch);
    gameOverModal.hide();
});

let p5level = new p5(sketch);

document.getElementById('pauseButton').addEventListener('click', function () {
    let gameOverModal = new bootstrap.Modal(document.getElementById('gameOverModal'));
    document.getElementById('gameOverModalLabel').textContent = 'Game Paused';
    document.getElementById('resumeButton').style.display = 'block';
    document.getElementById('playAgainButton').style.display = 'none';
    document.getElementById('ModalText').textContent = 'Game is paused choose an option!';
    gameOverModal.show();
    p5level.noLoop();
});
