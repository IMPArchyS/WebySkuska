import Platform from './Platform.js';

let levels = []; // Array to store all levels

let sketch = (level) => {
    level.preload = () => {
        level.loadJSON('../levels.json', (data) => {
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
            let levelElement = document.createElement('h3');
            levelElement.classList.add('level');
            levelElement.textContent = `Level ${level.id}`;

            // if the level was played, level label is clickable & sends player to the level
            if (localStorage.getItem(`level${level.id}Available`) === 'true') {
                levelElement.classList.add('completed');
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

/// DEBUG ONLY
/// TODO: Keep or remove this
///

document.getElementById('resetLevelsButton').addEventListener('click', resetLevels);

function resetLevels() {
    console.log('DEBUG: RESETTING PROGRESS');
    // Clear the completion status of each level
    localStorage.clear();

    // Reset the selected level id to 1
    localStorage.setItem('selectedLevelId', '1');
    localStorage.setItem('levelAmount', '0');

    console.log('DEBUG: LOCAL STORAGE:');
    console.log(localStorage);

    // reset links
    let levelElements = document.querySelectorAll('.level, .completed');
    levelElements.forEach((element) => {
        let clonedElement = element.cloneNode(true);
        element.parentNode.replaceChild(clonedElement, element);
    });
}
