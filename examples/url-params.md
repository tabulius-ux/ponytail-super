# URL Parameters

**Task:** "Parse and build URL query strings."

## Without Ponytail

```bash
npm install query-string
# 4.5 kB gzipped, 3.5M downloads/week
```

```js
import qs from "query-string";

// Parse
const params = qs.parse(location.search);
// → { page: "2", sort: "name", tags: ["js", "css"] }

// Build
const url = qs.stringify({ page: 2, sort: "name", tags: ["js", "css"] });
// → "page=2&sort=name&tags=js&tags=css"
```

## With Ponytail

```js
// Suitable for this query contract: strings and repeated keys.
const params = new URLSearchParams(location.search);

// Read
params.get("page");         // "2"
params.getAll("tags");      // ["js", "css"]

// Build
const out = new URLSearchParams({ page: 2, sort: "name" });
out.append("tags", "js");
out.append("tags", "css");
out.toString(); // "page=2&sort=name&tags=js&tags=css"
```

`URLSearchParams` can cover this strings-and-repeated-keys contract. Before replacing an existing parser, verify array/null handling, encoding, ordering, return types, and caller expectations. A query-string package may serve behavior beyond the native API.
