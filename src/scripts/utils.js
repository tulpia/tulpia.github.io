class Utils {
  constructor() {
    this.winsize = null;
    this.docScroll = null;
    this.lastScroll = null;
    this.scrollingSpeed = 0;

    this.calcWinsize();

    window.addEventListener("scroll", this.getPageYScroll);
    window.addEventListener("resize", this.calcWinsize);
  }

  calcWinsize() {
    this.winsize = {
      width: window.innerWidth,
      height: window.innerHeight
    };
  }

  getPageYScroll() {
    this.docScroll = window.pageYOffset || document.documentElement.scrollTop;
  }
}

export default Utils;
