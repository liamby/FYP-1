'use strict';

interactiveCanvas.ready({
    onUpdate(data) {
        document.querySelector('#mood').innerText = data[0].mood;
    }
});
