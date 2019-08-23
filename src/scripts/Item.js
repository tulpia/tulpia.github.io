import math from "./math";

let winsize;
const calcWinsize = () =>
  (winsize = { width: window.innerWidth, height: window.innerHeight });
calcWinsize();
// and recalculate on resize
window.addEventListener("resize", calcWinsize);

// // scroll position
let docScroll;
// // for scroll speed calculation
let lastScroll;
// let scrollingSpeed = 0;
// // scroll position update function
const getPageYScroll = () =>
  (docScroll = window.pageYOffset || document.documentElement.scrollTop);
window.addEventListener("scroll", getPageYScroll);

class Item {
  constructor(el) {
    // the .item element
    this.DOM = { el: el };
    // the inner image
    //   this.DOM.title = this.DOM.el.querySelector(".content__item-title");
    //   this.DOM.subTitle = this.DOM.el.querySelector(".content__item-number");
    this.DOM.subTitle = this.DOM.el.querySelector(".item__img-wrap");

    this.renderedStyles = {
      // here we define which property will change as we scroll the page and the item is inside the viewport
      // in this case we will be:
      // - scaling the inner image
      // - translating the item's title
      // we interpolate between the previous and current value to achieve a smooth effect
      imageScale: {
        // interpolated value
        previous: 0,
        // current value
        current: 0,
        // amount to interpolate
        ease: 0.1,
        // current value setter
        setValue: () => {
          const toValue = 1.5;
          const fromValue = 1;
          const val = math.map(
            this.props.top - docScroll,
            winsize.height,
            -1 * this.props.height,
            fromValue,
            toValue
          );
          return Math.max(Math.min(val, toValue), fromValue);
        }
      },
      titleTranslationY: {
        previous: 0,
        current: 0,
        ease: 0.1,
        fromValue: 150,
        setValue: () => {
          const fromValue = this.renderedStyles.titleTranslationY.fromValue;
          const toValue = -1 * fromValue;
          const val = math.map(
            this.props.top - docScroll,
            winsize.height,
            -1 * this.props.height,
            fromValue,
            toValue
          );
          return fromValue < 0
            ? Math.min(Math.max(val, fromValue), toValue)
            : Math.max(Math.min(val, fromValue), toValue);
        }
      },
      subTitleTranslationY: {
        previous: 0,
        current: 0,
        ease: 0.1,
        fromValue: Number(math.getRandomFloat(300, 500)),
        setValue: () => {
          const fromValue = this.renderedStyles.titleTranslationY.fromValue;
          const toValue = -1 * fromValue;
          const val = math.map(
            this.props.top - docScroll,
            winsize.height,
            -1 * this.props.height,
            fromValue,
            toValue
          );
          return fromValue < 0
            ? Math.min(Math.max(val, fromValue), toValue)
            : Math.max(Math.min(val, fromValue), toValue);
        }
      }
    };
    // gets the item's height and top (relative to the document)
    this.getSize();
    // set the initial values
    this.update();
    // use the IntersectionObserver API to check when the element is inside the viewport
    // only then the element styles will be updated
    this.observer = new IntersectionObserver(entries => {
      entries.forEach(entry => (this.isVisible = entry.intersectionRatio > 0));
    });
    this.observer.observe(this.DOM.el);
    // init/bind events
    this.initEvents();
  }
  update() {
    // sets the initial value (no interpolation)
    for (const key in this.renderedStyles) {
      this.renderedStyles[key].current = this.renderedStyles[
        key
      ].previous = this.renderedStyles[key].setValue();
    }
    // apply changes/styles
    this.layout();
  }
  getSize() {
    const rect = this.DOM.el.getBoundingClientRect();
    this.props = {
      // item's height
      height: rect.height,
      // offset top relative to the document
      top: docScroll + rect.top
    };
  }
  initEvents() {
    window.addEventListener("resize", () => this.resize());
  }
  resize() {
    // gets the item's height and top (relative to the document)
    this.getSize();
    // on resize reset sizes and update styles
    this.update();
  }
  render() {
    // update the current and interpolated values
    for (const key in this.renderedStyles) {
      this.renderedStyles[key].current = this.renderedStyles[key].setValue();
      this.renderedStyles[key].previous = math.lerp(
        this.renderedStyles[key].previous,
        this.renderedStyles[key].current,
        this.renderedStyles[key].ease
      );
    }

    // and apply changes
    this.layout();
  }
  layout() {
    // scale the image
    //   this.DOM.image.style.transform = `scale3d(${
    //     this.renderedStyles.imageScale.previous
    //   },${this.renderedStyles.imageScale.previous},1)`;
    // translate the title
    // this.DOM.title.style.transform = `translate3d(0,${
    //   this.renderedStyles.titleTranslationY.previous
    // }px,0)`;
    this.DOM.subTitle.style.transform = `translate3d(0,${
      this.renderedStyles.subTitleTranslationY.previous
    }px,0)`;
  }
}

export default Item;
