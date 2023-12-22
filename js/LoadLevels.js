import Platform from './Platform.js';

let levels = []; // Array to store all levels

let sketch = (level) => {
    level.preload = () => {
        level.loadJSON('../levels.json', (data) => {
            // Load all levels
            for (let levelData of data.levels) {
                let platforms = [];
                for (let platformData of levelData.platforms) {
                    let platform = new Platform(platformData.x, platformData.y, platformData.width, platformData.height, platformData.finish);
                    platforms.push(platform);
                }
                levels.push({ id: levelData.id, platforms: platforms });
            }
            console.log('LOADED LEVELS');
            console.log(levels);
            displayLevels();
            console.log('INIT OVER');
        });
    };

    function displayLevels() {
        console.log(localStorage);
        let levelsContainer = document.getElementById('levels-container');
        let selectedLevelId = localStorage.getItem('selectedLevelId');
        for (let level of levels) {
            let levelElement = document.createElement('div');
            levelElement.classList.add('level');
            levelElement.innerHTML = `<h3>Level ${level.id}</h3>`;

            let isLevelCompleted = localStorage.getItem(`level${level.id}Completed`) === 'true';
            console.log(isLevelCompleted);

            if (isLevelCompleted) {
                levelElement.classList.add('completed');
            }
            if (level.id === selectedLevelId) {
                levelElement.classList.add('selected');
            } else {
                levelElement.addEventListener('click', function () {
                    localStorage.setItem('selectedLevelId', level.id);
                    window.location.href = 'game.html';
                });
            }
            levelsContainer.appendChild(levelElement);
        }
    }
};

new p5(sketch);

document.getElementById('resetLevelsButton').addEventListener('click', resetLevels);

function resetLevels() {
    console.log('done');
    // Get the number of levels from the levels array
    let numberOfLevels = levels.length;

    // Clear the completion status of each level
    for (let i = 1; i <= numberOfLevels; i++) {
        localStorage.removeItem(`level${i}Completed`);
    }

    // Reset the highest unlocked level id to 1
    localStorage.setItem('highestUnlockedLevelId', '1');
    localStorage.setItem('selectedLevelId', '1');
    console.log(localStorage);
}
