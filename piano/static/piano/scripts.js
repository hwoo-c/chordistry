document.addEventListener('DOMContentLoaded', () => {
    attachAudiosToKeys();
});

const attachAudiosToKeys = () => {
    const audios = document.querySelectorAll('.key-audio');
    audios.forEach(audio => {
        const key = document.querySelector(`#${audio.dataset.key}`);
        console.log(key);
        attachAudioToKey(audio, key);
    });
}

const attachAudioToKey = (audio, key) => {
    /* Make audio play when clicking key */
    key.addEventListener('mousedown', event => {
        if (event.button === 0) { // Check if left mouse button clicked
            key.classList.add('key-clicked');
            audio.play();
        }
    });
    key.addEventListener('mouseup', () => {
        key.classList.remove('key-clicked');
        audio.pause();
        audio.src = audio.src;
    });
    key.addEventListener('mouseout', () => {
        key.classList.remove('key-clicked');
        audio.pause();
        audio.src = audio.src;
    });
}
