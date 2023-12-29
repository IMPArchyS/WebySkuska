if (!localStorage.getItem('nextLevelId')) {
    document.getElementById('continueGameButton').disabled = true;
} else document.getElementById('continueGameButton').disabled = false;

document.getElementById('startGameButton').addEventListener('click', function () {
    localStorage.clear();
    localStorage.setItem('selectedLevelId', '1');
    localStorage.setItem('levelOrder', '0');
    localStorage.setItem('level1Available', true);
    localStorage.setItem('nextLevelId', '1');
    localStorage.setItem('levelAmount', '0');
    window.location.href = 'pages/game.html';
});

document.getElementById('continueGameButton').addEventListener('click', function () {
    localStorage.setItem('selectedLevelId', localStorage.getItem('selectedLevelId'));
    window.location.href = 'pages/game.html';
});

document.getElementById('levelsButton').addEventListener('click', function () {
    window.location.href = 'pages/levels.html';
});

document.getElementById('tutorialButton').addEventListener('click', function () {
    window.location.href = 'pages/tutorial.html';
});
