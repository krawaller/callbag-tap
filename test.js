const test = require('tape');
const makeMockCallbag = require('callbag-mock');
const tap = require('./index');

test('it taps data with the given operation', t => {
  let history = [];
  const report = (name,dir,t,d) => t !== 0 && history.push([name,dir,t,d]);

  const source = makeMockCallbag('source', true);
  const middle = tap(v => history.push(['tap', v]));
  const sink = makeMockCallbag('sink', report);

  middle(source)(0, sink);

  source.emit(1, 'foo');
  source.emit(1, 'bar');
  source.emit(2, 'error');

  t.deepEqual(history, [
    ['tap', 'foo'],
    ['sink', 'body', 1, 'foo'],
    ['tap', 'bar'],
    ['sink', 'body', 1, 'bar'],
    ['sink', 'body', 2, 'error'],
  ], 'tap taps the data and passes everything through');

  t.end();
});

test('it taps error with the given operation', t => {
  let history = [];
  const report = (name,dir,t,d) => t !== 0 && history.push([name,dir,t,d]);

  const source = makeMockCallbag('source', true);
  const middle = tap(
    v => history.push(['tap', v]),
    e => history.push(['tap err', e])
  );
  const sink = makeMockCallbag('sink', report);

  middle(source)(0, sink);

  source.emit(1, 'foo');
  source.emit(1, 'bar');
  source.emit(2, 'error');

  t.deepEqual(history, [
    ['tap', 'foo'],
    ['sink', 'body', 1, 'foo'],
    ['tap', 'bar'],
    ['sink', 'body', 1, 'bar'],
    ['tap err', 'error'],
    ['sink', 'body', 2, 'error'],
  ], 'tap taps the error and passes everything through');

  t.end();
});

test('it taps completion with the given operation', t => {
  let history = [];
  const report = (name,dir,t,d) => t !== 0 && history.push([name,dir,t,d]);

  const source = makeMockCallbag('source', true);
  const middle = tap(
    v => history.push(['tap', v]),
    undefined,
    () => history.push(['tap completion'])
  );
  const sink = makeMockCallbag('sink', report);

  middle(source)(0, sink);

  source.emit(1, 'foo');
  source.emit(1, 'bar');
  source.emit(2);

  t.deepEqual(history, [
    ['tap', 'foo'],
    ['sink', 'body', 1, 'foo'],
    ['tap', 'bar'],
    ['sink', 'body', 1, 'bar'],
    ['tap completion'],
    ['sink', 'body', 2, undefined],
  ], 'tap taps the completion and passes everything through');

  t.end();
});

test('it passes requests back up', t => {
  let history = [];
  const report = (name,dir,t,d) => t !== 0 && history.push([name,dir,t,d]);

  const source = makeMockCallbag('source', report, true);
  const middle = tap(v => history.push(['tap', v]));
  const sink = makeMockCallbag('sink', report);

  middle(source)(0, sink);

  sink.emit(1);
  sink.emit(2);

  t.deepEqual(history, [
    ['source', 'talkback', 1, undefined],
    ['source', 'talkback', 2, undefined],
  ], 'source gets requests from sink');

  t.end();
});
