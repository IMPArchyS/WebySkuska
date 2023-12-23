document.getElementById('startGameButton').addEventListener('click', function () {
    localStorage.setItem('selectedLevelId', '1');
    localStorage.setItem('levelAmount', '0');
    window.location.href = 'pages/game.html';
});
