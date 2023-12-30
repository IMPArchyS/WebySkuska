window.addEventListener('load', function () {
    let paragraph1 = document.getElementById('computer_tutorial');
    let paragraph2 = document.getElementById('phone_tutorial');
    let gyroPresent = false;

    if (
        navigator.userAgent.match(/Android/i) ||
        navigator.userAgent.match(/webOS/i) ||
        navigator.userAgent.match(/iPhone/i) ||
        navigator.userAgent.match(/iPad/i) ||
        navigator.userAgent.match(/iPod/i) ||
        navigator.userAgent.match(/BlackBerry/i) ||
        navigator.userAgent.match(/Windows Phone/i)
    ) {
        gyroPresent = true;
    } else {
        gyroPresent = false;
    }
    if (!gyroPresent) {
        paragraph1.style.display = 'block';
        paragraph2.style.display = 'none';
    } else {
        paragraph1.style.display = 'none';
        paragraph2.style.display = 'block';
    }
});
