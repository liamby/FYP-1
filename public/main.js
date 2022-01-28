'use strict';

interactiveCanvas.ready({
    onUpdate(data) {
        document.querySelector('#mood').innerText = data[0].mood;
        document.querySelector('#user-message').innerText = data[0].input;
    }
});
