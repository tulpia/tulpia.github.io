/* TODO */
// 1/ Ajouter effet sur les images (parallax)
// 2/ Ajouter menu avec anim

import imagesLoaded from 'imagesloaded';
import Smooth from './smooth';
import { TweenMax, TimelineLite, Expo, Circ } from 'gsap';
import SplitText from 'gsap/SplitText';

const textLoader = new SplitText(document.querySelector('.text-container p'), { type: 'chars'});
const loaderContainer = document.querySelector('.loader');
const textIntro = new SplitText(document.querySelector('.home-main-text'), { type: 'lines'});
const elementsIntroBefore = document.querySelector('.intro-elements-after');
const elementsIntro = document.querySelector('.intro-elements');
const elementsIntroAfter = document.querySelectorAll('.back-text__container');

// ----- ANIMATIONS
// Anim Entry
let loaderTimelineBegin = new TimelineLite({paused: true});
loaderTimelineBegin.staggerFrom(textLoader.chars, 0.85, {
  y: 55,
  ease: Circ.easeInOut
}, 0.035);

// Anim Out
let loaderTimelineOut = new TimelineLite({paused: true});
loaderTimelineOut.staggerTo(textLoader.chars, 0.85, {
  y: -55,
  ease: Circ.easeInOut
}, 0.035)
  .to(loaderContainer, 1.4, {
    yPercent: -100,
    ease: Expo.easeInOut
  }, '-=0.8')
  .fromTo(elementsIntroBefore, 0.6, {
    y: 20,
    opacity: 0
  }, {
    y: 0,
    opacity: 0.2
  }, '-=0.6')
  .staggerFrom(textIntro.lines, 0.7, {
    y: 20,
    opacity: 0
  },  0.1, '-=0.5')
  .from(elementsIntro, 0.6, {
    opacity: 0
  }, '-=0.45')
  .staggerFromTo(elementsIntroAfter, 0.6, {
    opacity: 0
  }, {
    opacity: 0.7
  }, 0.05, '-=0.6');

const preloadImages = () => {
  return new Promise((resolve, reject) => {
    loaderTimelineBegin.play();
    imagesLoaded(document.querySelectorAll('.item__img'), {background: true}, resolve);
  });
};

preloadImages().then(() => {
  const smooth = new Smooth();
  smooth.preload();
  setTimeout(() => {
    loaderTimelineOut.play();
  }, 2000);
});

// Intersection observer
// const options = {
//   root: document.querySelector('[data-scroll]'),
//   rootMargin: '0px',
//   threshold: 1.0
// };

// const callback = function(entries, observer) { 
//   entries.forEach(entry => {
//     console.log(entry);
//   });
// };

// const observer = new IntersectionObserver(callback, options);

// const aboutContainer = document.querySelector('.block-projets');

// observer.observe(aboutContainer);