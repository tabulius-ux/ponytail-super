# Number Formatting

**Task:** "Format numbers as currency and with thousand separators."

## Without Ponytail

```bash
npm install numeral
# or: npm install accounting
```

```js
import numeral from "numeral";

numeral(1234567.89).format("$1,234.00"); // "$1,234,567.89"
numeral(0.745).format("0.0%");           // "74.5%"
numeral(1500).format("0.0a");            // "1.5k"
```

## With Ponytail

```js
// Use explicit options for the required locale and precision.
new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" })
  .format(1234567.89);
// → "$1,234,567.89"

new Intl.NumberFormat("en-US", { style: "percent", minimumFractionDigits: 1, maximumFractionDigits: 1 })
  .format(0.745);
// → "74.5%"

new Intl.NumberFormat("en-US", { notation: "compact" })
  .format(1500);
// → "1.5K"
```

A native formatter can cover locale-aware presentation. Preserve the required rounding and precision, and verify target-runtime locale data. The compact examples differ in case (`k` vs `K`); do not change exact output contracts silently. Formatting does not replace precise money arithmetic.
