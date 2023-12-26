if (!(localStorage.getItem('selectedLevelId') === '1')) document.getElementById('continueGameButton').disabled = false;
else document.getElementById('continueGameButton').disabled = true;

document.getElementById('startGameButton').addEventListener('click', function () {
    localStorage.setItem('selectedLevelId', '1');
    localStorage.setItem('levelAmount', '0');
    window.location.href = 'pages/game.html';
});

document.getElementById('continueGameButton').addEventListener('click', function () {
    window.location.href = 'pages/game.html';
});
