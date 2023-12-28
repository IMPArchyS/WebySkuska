window.addEventListener('load', function () {
    var paragraph1 = document.getElementById('computer_tutorial');
    var paragraph2 = document.getElementById('phone_tutorial');
    var gyroPresent = false;

    if (navigator.userAgent.match(/Android/i)
        || navigator.userAgent.match(/webOS/i)
        || navigator.userAgent.match(/iPhone/i)
        || navigator.userAgent.match(/iPad/i)
        || navigator.userAgent.match(/iPod/i)
        || navigator.userAgent.match(/BlackBerry/i)
        || navigator.userAgent.match(/Windows Phone/i)) {
        gyroPresent = true;
    } else {
        gyroPresent = false;
    }
    if (!gyroPresent) {
        paragraph1.style.display = 'block';
        paragraph2.style.display = 'none';
        console.log('DeviceOrientation is not supported');
    } else {
        paragraph1.style.display = 'none';
        paragraph2.style.display = 'block';
        console.log('DeviceOrientation is supported');
    }

});