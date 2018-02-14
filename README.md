# callbag-tap

[Callbag](https://github.com/callbag/callbag) operator that taps the source with the given function, but otherwise acts as a noop.

Therefore it is not the same as [forEach](https://github.com/staltz/callbag-for-each) which is a sink (that actively consumes iterable sources).

`npm install callbag-tap`

## example

```js
const fromIter = require('callbag-from-iter');
const tap = require('callbag-tap');
const forEach = require('callbag-for-each');

const source = fromIter([1,2,3]);
const tapped = tap(x => console.log("tap", x))(source);
const sink = forEach(x => console.log("sink", x))(tapped);

// tap 1
// sink 1
// tap 2
// sink 2
// tap 3
// sink 3
```
