function sum(a, b) {
  if (typeof a === 'number' && typeof b === 'number') {
    return a + b;
  }
  throw new TypeError('arguments must be numbers');
}

module.exports = sum;
