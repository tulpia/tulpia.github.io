import math from './math';

// Start outside the screen
let clientX = -100;
let clientY = -100;
let lastX = 0;
let lastY = 0;
const smallCursor = document.querySelector('.cursor--small');
const bigCursor = document.querySelector('.cursor--big');

const initCursor = () => {
    document.addEventListener('mousemove', (e) => {
        clientX = e.clientX;
        clientY = e.clientY;
    });
    
    const render = () => {
        lastX = math.lerp(lastX, clientX, 0.15);
        lastY = math.lerp(lastY, clientY, 0.15);
        smallCursor.style.transform = `translate(${clientX}px, ${clientY}px)`;
        bigCursor.style.transform = `translate(${lastX}px, ${lastY}px)`;

        requestAnimationFrame(render);
    };

    requestAnimationFrame(render);
};

initCursor();
