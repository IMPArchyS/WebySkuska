import * as constants from './Constants.js';
import Player from './Player.js';

let sketch = (level) => {
    let player;
    let gamma = 0;
    level.setup = () => {
        let canvas = level.createCanvas(level.windowWidth, level.windowHeight);
        canvas.parent('canvas-container');
        level.background(200);
        level.windowResized(); // Ensure correct canvas size at start
        player = new Player(level.width / 2 - 25, level.height - 50); // Create a new player object
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
        level.background(200);
        level.handlePlayer();
        document.getElementById('gammaDebug').textContent = 'gamma: ' + gamma.toFixed(3);
    };

    level.windowResized = () => {
        let containerWidth = level.select('#canvas-container').width;
        level.resizeCanvas(containerWidth, level.windowHeight);
        level.background(200);
    };

    level.handlePlayer = () => {
        level.fill(255, 0, 0);
        level.rect(player.x, player.y, 50, 50);
        player.jump(level, constants.gravity);
        player.input(level, constants, gamma);
    };
};

new p5(sketch);
