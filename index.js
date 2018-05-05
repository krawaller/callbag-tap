const tap = (o, e, c) => source => (start, sink) => {
  if (start !== 0) return;
  source(0, (t, d) => {
    if (t === 1) o(d);
    else if (t === 2) {
      if (d) e && e(d)
      else c && c();
    }
    sink(t, d);
  });
};

module.exports = tap;
