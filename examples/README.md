# Examples

The five examples in the table are historical model output, verbatim from benchmark runs, the same task answered by the same model
with no skill (`## Without Ponytail`) and with ponytail (`## With Ponytail`), so you can
compare side by side. Model: Claude Haiku 4.5, temperature 1, source `benchmarks/output.json`.

Those five outputs are not hand-written and predate the revised safeguards. Their line counts do not establish behavioral equivalence, safety, or quality. Notes on each page identify important limits without rewriting the recorded output. Other pages in this directory are illustrative comparisons, not results from this five-task experiment.

To reproduce the historical setup:
`npx promptfoo@latest eval -c benchmarks/promptfooconfig.yaml`. Method, all three models, and
median-of-10 numbers: [../benchmarks/](../benchmarks/).

| Example | Without (LOC) | With (LOC) |
|---|--:|--:|
| [Email Validation](email-validation.md) | 75 | 3 |
| [Debounce](debounce.md) | 116 | 10 |
| [CSV Sum](csv-sum.md) | 20 | 3 |
| [Countdown Timer](react-countdown.md) | 267 | 9 |
| [Rate Limiting](rate-limit.md) | 128 | 10 |
