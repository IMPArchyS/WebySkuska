let levels = []; // Array to store all levels
let levelAmount = 0; // Amount of levels in the game
let sketch = (level) => {
    level.preload = () => {
        level.loadJSON('../levels.json', (data) => {
            levelAmount = data.levels.length;
            localStorage.setItem('levelAmount', levelAmount);
            displayLevels();
        });
    };

    function displayLevels() {
        for (let i = 1; i <= levelAmount; i++) {
            // create elements for each level
            let levelElement = document.createElement('button');
            levelElement.classList.add('btn', 'btn-custom', 'btn-rounded', 'm-1', 'fs-4', 'w-50');
            levelElement.textContent = `Level ${i}`;
            levelElement.disabled = true; // by default, level is not clickable

            // if the level was played, level label is clickable & sends player to the level
            if (localStorage.getItem(`level${i}Available`) === 'true') {
                levelElement.disabled = false;
                levelElement.addEventListener('click', function () {
                    if (localStorage.getItem('levelOrder') !== 0) {
                        localStorage.setItem('selectedLevelId', i);
                        window.location.href = 'game.html';
                    }
                });
            }
            document.getElementById('levels-container').appendChild(levelElement);
        }
    }
};

new p5(sketch);

document.getElementById('resetLevelsButton').addEventListener('click', resetLevels);

function resetLevels() {
    // Clear the completion status of each level
    localStorage.clear();

    // Reset the selected level id to 1
    localStorage.setItem('levelAmount', '1');

    // reset links
    let levelElements = document.querySelectorAll('button');
    let filteredElements = Array.from(levelElements).filter((element) => element.textContent.startsWith('Level'));
    filteredElements.forEach((element) => {
        element.disabled = true;
    });
}
