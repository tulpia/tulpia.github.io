import math from './math';
import imagesLoaded from 'imagesloaded';

const config = {
    height: window.innerHeight,
    width: window.innerWidth
};
  
class Smooth {
    constructor() {
        this.bindMethods();

        this.data = {
        ease: 0.1,
        current: 0,
        last: 0
        };

        this.dom = {
        el: document.querySelector('[data-scroll]'),
        content: document.querySelector('[data-scroll-content]')
        };

        this.rAF = null;

        this.init();
    }

    bindMethods() {
        ['scroll', 'run', 'resize']
        .forEach((fn) => this[fn] = this[fn].bind(this));
    }

    setStyles() {
        Object.assign(this.dom.el.style, {
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100%',
        width: '100%',
        overflow: 'hidden'        
        });   
    }

    setHeight() {
        document.body.style.height = `${this.dom.content.offsetHeight}px`;
    }

    resize() {
        this.setHeight();
        this.scroll();
    }

    preload() {
        imagesLoaded(this.dom.content, (instance) => {
            this.setHeight();
        });
    }

    scroll() {
        this.data.current = window.scrollY;
    }

    run() {
        this.data.last = math.lerp(this.data.last, this.data.current, this.data.ease);
        if (this.data.last < .1) {
        this.data.last = 0;
        }
        
        const diff = this.data.current - this.data.last;
        const acc = diff / config.width;
        const velo =+ acc;
        const skew = velo * 10;
        
        this.dom.content.style.transform = `translate3d(0, -${this.data.last}px, 0) skewY(${skew}deg)`;

        this.requestAnimationFrame();
    }

    on() { 
        this.setStyles();
        this.setHeight();
        this.addEvents();

        this.requestAnimationFrame();
    }

    off() {
        this.cancelAnimationFrame();

        this.removeEvents();
    }

    requestAnimationFrame() {
        this.rAF = requestAnimationFrame(this.run);
    }

    cancelAnimationFrame() {
        cancelAnimationFrame(this.rAF);
    }

    destroy() {
        document.body.style.height = '';

        this.data = null;

        this.removeEvents();
        this.cancelAnimationFrame();
    }

    resize() {
        this.setHeight();
    }

    addEvents() {
        window.addEventListener('resize', this.resize, { passive: true });
        window.addEventListener('scroll', this.scroll, { passive: true });
    }

    removeEvents() {
        window.removeEventListener('resize', this.resize, { passive: true });
        window.removeEventListener('scroll', this.scroll, { passive: true });
    }

    init() {
        // this.preload();
        this.on();
    }
}

export default Smooth;