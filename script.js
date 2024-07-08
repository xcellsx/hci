function setColorBasedOnHour(hour) {
    var container = document.querySelector('.container');
    var clouds = document.querySelectorAll('.cloud');
    var mountain = document.querySelector('.mountain');
    var trainCar = document.querySelector('.train-car');
    var door = document.querySelector('.door');
    var track = document.querySelectorAll('.train-track');
    var ledge = document.querySelector('.ledge');

    var cloudClass = '';
    var mountainClass = '';
    var trainClass = '';
    var doorClass = '';

    if (hour >= 6 && hour < 9) { // 6:00 - 9:00
        container.className = 'container daytime';
        cloudClass = 'cloud-daytime';
        mountainClass = 'mountain-daytime';
        trainClass = 'train-car-daytime';
        doorClass = 'door-daytime';

    } else if (hour >= 9 && hour < 12) { // 9:00 - 12:00
        container.className = 'container mid-morning';
        cloudClass = 'cloud-mid-morning';
        mountainClass = 'mountain-mid-morning';
        trainClass = 'train-car-mid-morning';
        doorClass = 'door-mid-morning';

    } else if (hour >= 12 && hour < 16) { // 12:00 - 16:00
        container.className = 'container noon';
        cloudClass = 'cloud-noon';
        mountainClass = 'mountain-noon';
        trainClass = 'train-car-noon';
        doorClass = 'door-noon';

    } else if (hour >= 16 && hour < 20) { // 16:00 - 20:00
        container.className = 'container evening';
        cloudClass = 'cloud-evening';
        mountainClass = 'mountain-evening';
        trainClass = 'train-car-evening';
        doorClass = 'door-evening';

    } else { // 20:00 - 6:00
        container.className = 'container nighttime';
        cloudClass = 'cloud-nighttime';
        mountainClass = 'mountain-nighttime';
        trainClass = 'train-car-nighttime';
        doorClass = 'door-nighttime';
    }

    // Apply the cloud class to all cloud elements
    clouds.forEach(function(cloud) {
        cloud.className = 'cloud ' + cloudClass;
    });

    // Apply the mountain class
    mountain.className = 'mountain ' + mountainClass;

    // Apply the train class
    trainCar.className = 'train-car ' + trainClass;

    // Apply the door class
    door.className = 'door ' + doorClass;

}   

var now = new Date();
var hour = now.getHours();
setColorBasedOnHour(hour); // Set the initial color based on the current hour

// Update the color every hour
setInterval(function () {
    now = new Date();
    hour = now.getHours();
    setColorBasedOnHour(hour);
}, 3600000); // 3600000 milliseconds = 1 hour
