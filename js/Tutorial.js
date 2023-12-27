window.addEventListener('load', function () {
    var paragraph1 = document.getElementById('computer_tutorial');
    var paragraph2 = document.getElementById('phone_tutorial');
    if (window.DeviceOrientationEvent) {
        paragraph1.style.display = 'block';
        paragraph2.style.display = 'none';
        console.log('DeviceOrientation is supported');
    } else {
        paragraph1.style.display = 'none';
        paragraph2.style.display = 'block';
        console.log('DeviceOrientation is not supported');
    }

});