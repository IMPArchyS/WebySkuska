document.getElementById('startGameButton').addEventListener('click', function () {
    localStorage.setItem('selectedLevelId', '1');
    window.location.href = 'pages/game.html';
});
