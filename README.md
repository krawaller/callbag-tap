# callbag-tap

[Callbag](https://github.com/callbag/callbag) operator that allows you to `tap` data, error and completion. Allows you to inspect and do side effects without disturbing the stream.

In contrast to [forEach](https://github.com/staltz/callbag-for-each) which is a sink and actively consumes sources), `tap` does not consume sources.

Install with:
`npm install callbag-tap`

You can tap data, error and completion respectively:

```js
const tapped = tap(dataTapFunc, errorTapFunc, completionTapFunc)(source);
```

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
