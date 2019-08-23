import math from "./math";
import Item from "./Item";
import Utils from "./utils";

class SmoothScroll {
  constructor() {
    this.body = document.querySelector("body");
    console.log(this.body);
    // the <main> element
    this.DOM = { main: document.querySelector("main") };
    // the scrollable element
    // we translate this element when scrolling (y-axis)
    this.DOM.scrollable = this.DOM.main.querySelector(
      "div[data-scroll-content]"
    );
    // the items on the page
    this.items = [];
    this.utils = new Utils();
    this.DOM.content = this.DOM.main.querySelector(".wrapper");
    [
      ...this.DOM.content.querySelectorAll(".projets-container__projet")
    ].forEach(item => this.items.push(new Item(item)));
    // here we define which property will change as we scroll the page
    // in this case we will be translating on the y-axis
    // we interpolate between the previous and current value to achieve the smooth scrolling effect
    this.renderedStyles = {
      translationY: {
        // interpolated value
        previous: 0,
        // current value
        current: 0,
        // amount to interpolate
        ease: 0.05,
        skew: 0,
        // current value setter
        // in this case the value of the translation will be the same like the document scroll
        setValue: () => docScroll
      }
    };
    // set the body's height
    this.setSize();
    // set the initial values
    this.update();
    // the <main> element's style needs to be modified
    this.style();
    // init/bind events
    this.initEvents();
    // start the render loop
    requestAnimationFrame(() => this.render());
  }
  update() {
    // sets the initial value (no interpolation) - translate the scroll value
    for (const key in this.renderedStyles) {
      this.renderedStyles[key].current = this.renderedStyles[
        key
      ].previous = this.renderedStyles[key].setValue();
    }
    // translate the scrollable element
    this.layout();
  }
  layout() {
    this.DOM.scrollable.style.transform = `translate3d(0,${-1 *
      this.renderedStyles.translationY.previous}px,0) skewY(${
      this.renderedStyles.translationY.skew
    }deg)`;
  }
  setSize() {
    // set the heigh of the body in order to keep the scrollbar on the page
    document.querySelector("body").style.height = `${
      this.DOM.scrollable.scrollHeight
    }px`;
  }
  style() {
    // the <main> needs to "stick" to the screen and not scroll
    // for that we set it to position fixed and overflow hidden
    this.DOM.main.style.position = "fixed";
    this.DOM.main.style.width = this.DOM.main.style.height = "100%";
    this.DOM.main.style.top = this.DOM.main.style.left = 0;
    this.DOM.main.style.overflow = "hidden";
  }
  initEvents() {
    // on resize reset the body's height
    window.addEventListener("resize", () => this.setSize());
  }
  render() {
    // Get scrolling speed
    // Update lastScroll
    scrollingSpeed = Math.abs(this.docScroll - lastScroll);
    lastScroll = docScroll;

    // update the current and interpolated values
    for (const key in this.renderedStyles) {
      const diff =
        this.renderedStyles[key].current - this.renderedStyles[key].previous;
      const acc = diff / window.innerWidth;
      const velo = +acc;

      this.renderedStyles[key].skew = velo * 10;
      this.renderedStyles[key].current = this.renderedStyles[key].setValue();
      this.renderedStyles[key].previous = math.lerp(
        this.renderedStyles[key].previous,
        this.renderedStyles[key].current,
        this.renderedStyles[key].ease
      );
    }
    // and translate the scrollable element
    this.layout();

    // for every item
    for (const item of this.items) {
      // if the item is inside the viewport call it's render function
      // this will update item's styles, based on the document scroll value and the item's position on the viewport
      if (item.isVisible) {
        if (item.insideViewport) {
          item.render();
        } else {
          item.insideViewport = true;
          item.update();
        }
      } else {
        item.insideViewport = false;
      }
    }

    // loop..
    requestAnimationFrame(() => this.render());
  }
}

export default SmoothScroll;
