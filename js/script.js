var ball = document.getElementById('ball');
var speed = 5;

window.addEventListener('keydown', function(event) {
    var rect = ball.getBoundingClientRect();

    switch(event.key) {
        case 'w':
        case 'ArrowUp':
            ball.style.top = (rect.top - speed) + 'px';
            break;
        case 'a':
        case 'ArrowLeft':
            ball.style.left = (rect.left - speed) + 'px';
            break;
        case 's':
        case 'ArrowDown':
            ball.style.top = (rect.top + speed) + 'px';
            break;
        case 'd':
        case 'ArrowRight':
            ball.style.left = (rect.left + speed) + 'px';
            break;
    }
});