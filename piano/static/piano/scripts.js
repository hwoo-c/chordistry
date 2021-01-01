document.addEventListener('DOMContentLoaded', () => {
    attachAudiosToKeys();
});

const attachAudiosToKeys = () => {
    const audios = document.querySelectorAll('.key-audio');
    audios.forEach(audio => {
        const key = document.querySelector(`#${audio.dataset.key}`);
        attachAudioToKey(audio, key);
    });
}

/* Make audio play when clicking key */
const attachAudioToKey = (audio, key) => {
    key.addEventListener('mousedown', event => {
        // Check if left mouse button clicked
        if (event.button === 0 && !key.classList.contains('block-mouse-events')) {
            audio.currentTime = 0;
            key.classList.add('key-clicked');
            audio.play();
        }
    });
    key.addEventListener('mouseup', () => {
        if (!key.classList.contains('block-mouse-events')) {
            key.classList.remove('key-clicked');
            audio.pause();
            audio.currentTime = 0;
        }
    });
    key.addEventListener('mouseout', () => {
        if (!key.classList.contains('block-mouse-events')) {
            key.classList.remove('key-clicked');
            audio.pause();
            audio.currentTime = 0;
        }
    });
}

/* Keep track of active button press timeouts */
var keyTimeouts = []

/* Pass in key element, and hold time in ms */
const clickKey = (key, ms) => {
    const event = new MouseEvent('mousedown', {
        view: window,
        bubbles: true,
        cancelable: true
    });
    key.dispatchEvent(event);
    const timeoutID = setTimeout(() => {
        unclickKey(key);
    }, ms);

    keyTimeouts.push(
        {
            timeoutID: timeoutID,
            key: key
        }
    );
}

const unclickKey = (key) => {
    key.classList.remove('block-mouse-events');
    const event = new MouseEvent('mouseup', {
        view: window,
        bubbles: true,
        cancelable: true
    });
    key.dispatchEvent(event);
}

/* Pass in key IDs as array, and hold time in ms */
const clickKeys = (keyIDs, ms) => {
    let t0 = performance.now();
    keyTimeouts.forEach(timeout => {
        clearTimeout(timeout.timeoutID);
        unclickKey(timeout.key);
    });
    keyTimeouts = [];

    keyIDs.forEach(keyID => {
        key = document.getElementById(keyID);
        clickKey(key, ms);
        key.classList.add('block-mouse-events'); // Note: class added after timeout has been set in clickKey
    });
    let t1 = performance.now();
    console.log(`${t1 - t0}ms`);
}
