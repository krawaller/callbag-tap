const tap = o => source => (start, sink) => {
  if (start !== 0) return;
  source(0, (t, d) => {
    if (t === 1) o(d);
    sink(t, d);
  });
};

module.exports = tap;
