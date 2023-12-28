import Platform from './Platform.js';

let levels = []; // Array to store all levels
let levelAmount = 0; // Amount of levels in the game
let sketch = (level) => {
    level.preload = () => {
        level.loadJSON('../levels.json', (data) => {
            levelAmount = data.levels.length;
            localStorage.setItem('levelAmount', levelAmount);
            for (let levelData of data.levels) {
                levels.push({ id: levelData.id });
            }
            console.log('LOADED LEVELS');
            console.log(levels);
            displayLevels();
            console.log('// INIT OVER //');
        });
    };

    function displayLevels() {
        console.log('STORED LEVELS:');
        console.log(localStorage);
        for (let level of levels) {
            // create elements for each level
            var levelElement = document.createElement('button');
            levelElement.classList.add('btn', 'btn-custom', 'btn-rounded', 'm-1', 'fs-4', 'w-50');
            levelElement.textContent = `Level ${level.id}`;
            levelElement.disabled = true; // by default, level is not clickable

            // if the level was played, level label is clickable & sends player to the level
            if (localStorage.getItem(`level${level.id}Available`) === 'true') {
                levelElement.disabled = false;
                levelElement.addEventListener('click', function () {
                    localStorage.setItem('selectedLevelId', level.id);
                    window.location.href = 'game.html';
                });
            }
            document.getElementById('levels-container').appendChild(levelElement);
        }
    }
};

new p5(sketch);

document.getElementById('resetLevelsButton').addEventListener('click', resetLevels);

function resetLevels() {
    console.log('DEBUG: RESETTING PROGRESS');
    // Clear the completion status of each level
    localStorage.clear();

    // Reset the selected level id to 1
    localStorage.setItem('selectedLevelId', '1');
    localStorage.setItem('levelAmount', '1');

    console.log('DEBUG: LOCAL STORAGE:');
    console.log(localStorage);

    // reset links
    let levelElements = document.querySelectorAll('button');
    let filteredElements = Array.from(levelElements).filter((element) => element.textContent.startsWith('Level'));
    filteredElements.forEach((element) => {
        element.disabled = true;
    });
}
