function Poisson() {
  this.getPoisson = function (lambda) {
    let L = Math.exp(-lambda);
    let p = 1.0;
    let k = 0;

    do {
      k++;
      p *= Math.random();
    } while (p > L);

    return k - 1;
  };
}
