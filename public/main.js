'use strict';

interactiveCanvas.ready({
    onUpdate(data) {
        if (data[0].scene == 'homePage'){
            document.querySelector('#home-page').style.display = 'block';
            document.querySelector('#mood-logging').style.display = 'none';
            document.querySelector('#journaling').style.display = 'none';
        
        }else if (data[0].scene == 'moodLogging'){
            document.querySelector('#home-page').style.display = 'none';
            document.querySelector('#mood-logging').style.display = 'block';
            document.querySelector('#journaling').style.display = 'none';
            document.querySelector('#mood-choice').src = `images/${data[0].mood}.gif`;

        }else if (data[0].scene == 'journaling'){
            document.querySelector('#home-page').style.display = 'none';
            document.querySelector('#mood-logging').style.display = 'none';
            document.querySelector('#journaling').style.display = 'block';
            document.querySelector('#user-message').innerText = data[0].input;
        }
    }
});