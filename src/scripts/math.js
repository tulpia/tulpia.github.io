const math = {
  lerp: (a, b, n) => {
    return (1 - n) * a + n * b;
  },
  norm: (value, min, max) => {
    return (value - min) / (max - min);
  },
  map: (x, a, b, c, d) => ((x - a) * (d - c)) / (b - a) + c,
  getRandomFloat: (min, max) => (Math.random() * (max - min) + min).toFixed(2)
};

export default math;
