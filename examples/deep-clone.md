# Deep Clone

**Task:** "Deep clone this object."

## Without Ponytail

```bash
npm install lodash
```

```js
import { cloneDeep } from "lodash";

const copy = cloneDeep(original);
```

Or the classic hack:

```js
// fragile: loses Date, undefined, Map, Set, circular refs, functions
const copy = JSON.parse(JSON.stringify(original));
```

## With Ponytail

```js
// Suitable when the object contains only supported cloneable values.
const copy = structuredClone(original);
```

`structuredClone` is a candidate for supported cloneable data, not a general drop-in for every deep-clone utility. Check unsupported values, prototypes, error behavior, and target support against callers. Keep the existing helper or dependency if those differences matter.
