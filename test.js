const test = require('tape');
const makeMockCallbag = require('callbag-mock');
const tap = require('./index');

test('it taps data with the given operation', t => {
  let tapped = [];

  const source = makeMockCallbag(true);
  const middle = tap(v => tapped.push(v));
  const sink = makeMockCallbag();

  middle(source)(0, sink);

  source.emit(1, 'foo');
  source.emit(1, 'bar');
  source.emit(2, 'error');

  t.deepEqual(tapped, ['foo','bar'], 'tap function is called with all data');
  t.deepEqual(sink.getReceivedData(), ['foo','bar'], 'tap passes data on down');
  t.end();
});

test('it taps error with the given operation', t => {
  let tappedData = [];
  let tappedError;

  const source = makeMockCallbag(true);
  const middle = tap(
    v => tappedData.push(v),
    e => tappedError = e
  );
  const sink = makeMockCallbag();

  middle(source)(0, sink);

  source.emit(1, 'foo');
  source.emit(1, 'bar');
  source.emit(2, 'error');

  t.deepEqual(tappedData, ['foo','bar'], 'it taps data as per normal');
  t.deepEqual(tappedError, 'error', 'it taps the error');
  t.ok(!sink.checkConnection(), 'the error was passed through');
  t.end();
});

test('it taps completion with the given operation', t => {
  let tappedData = [];
  let tappedCompletion;

  const source = makeMockCallbag(true);
  const middle = tap(
    v => tappedData.push(v),
    undefined,
    () => tappedCompletion = true
  );
  const sink = makeMockCallbag();

  middle(source)(0, sink);

  source.emit(1, 'foo');
  source.emit(1, 'bar');
  source.emit(2);

  t.deepEqual(tappedData, ['foo','bar'], 'it taps data as per normal');
  t.ok(tappedCompletion, 'the tapCompletion callback was called');
  t.ok(!sink.checkConnection(), 'the termination was passed through');
  t.end();
});

test('it passes requests back up', t => {
  let history = [];
  const report = (t,d) => t !== 0 && history.push([t,d]);

  const source = makeMockCallbag(report, true);
  const middle = tap(v => {});
  const sink = makeMockCallbag();

  middle(source)(0, sink);

  sink.emit(1);
  sink.emit(2);

  t.deepEqual(history, [
    [1, undefined],
    [2, undefined],
  ], 'source gets requests from sink');

  t.end();
});
