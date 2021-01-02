document.addEventListener('DOMContentLoaded', () => {
    createPiano();
});

const fetchKeys = async () => {
    let response = await fetch('/static/piano/keys.json')
    response = await response.json()
    return response;
}

const createPiano = async () => {
    const keyInfo = await fetchKeys();
    createAudioTags(keyInfo.keys);
    createKeys(keyInfo);
}

const createAudioTags = keys => {
    const wrapper = document.querySelector('#key-audios-wrapper');
    keys.forEach(key => {
        const audio = document.createElement('audio');
        audio.className = 'key-audio';
        audio.dataset.key = key.name;
        audio.src = `/static/piano/audio/Piano.pp.${key.name}.mp3`;
        audio.volume = 1;
        wrapper.append(audio);
    })
}

const createKeys = keyInfo => {
    const wrapper = document.querySelector('#piano-svg-wrapper');

    const whiteOffset = parseFloat(keyInfo.whiteOffset);
    const blackOffset = parseFloat(keyInfo.blackOffset);
    let posx = -whiteOffset;
    
    let blackKeyIDs = [];

    keyInfo.keys.forEach(key => {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
        svg.id = key.name;
        svg.classList.add(`key`);
        svg.classList.add(`${key.color}-key`);
        if (key.color === 'white') {
            svg.setAttribute('fill', '#fff');
            svg.innerHTML = '<path stroke-width="2" stroke="#000" d="M 5 5 L 5 155 L 45 155 L 45 5 L 5 5 z" />'
            posx += whiteOffset;
            svg.setAttribute('x', `${posx}%`);
        }
        else {
            svg.setAttribute('fill', '#000');
            svg.innerHTML = '<path stroke-width="2" stroke="#000" d="M 5 5 L 5 90 L 30 90 L 30 5 L 5 5 z" />'
            blackKeyIDs.push(key.name);
            svg.setAttribute('x', `${posx+blackOffset}%`);
        }
        svg.setAttribute('y', `0%`);

        wrapper.append(svg);
    });

    /* 
        Make black keys appear on top 
        Source: https://stackoverflow.com/questions/17786618/how-to-use-z-index-in-svg-elements
    */
    blackKeyIDs.forEach(id => {
        wrapper.innerHTML += `<use xlink:href="#${id}" />`
    });

    attachAudiosToKeys();
}

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
    console.log(`clickKeys run time: ${t1 - t0}ms`);
}
