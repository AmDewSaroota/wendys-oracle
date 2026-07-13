# Google Sheets v4 API — Text Color Field Name

**Date**: 2026-07-13
**Context**: NDF quotation Google Sheets script (`create-quotation-sheet.ts`)

## Rule

Text (foreground) color in `batchUpdate` must be:
```json
{ "textFormat": { "foregroundColor": { "red": 1, "green": 1, "blue": 1 } } }
```

NOT:
```json
{ "foregroundColorStyle": { "rgbColor": { ... } } }
```

`foregroundColorStyle` exists only in read responses (some API versions) — it is NOT a valid write field.

## Fields mask

Always use `fields: "userEnteredFormat"` as the blanket mask for `repeatCell.fields`. Do NOT use `Object.keys(format).join(",")` — this only catches top-level keys and misses nested paths like `textFormat/foregroundColor`.

## Border color

Border color is `color: { red, green, blue }` — NOT `colorStyle`.

## Helper pattern (validated)

```typescript
function mkFmt(opts: { bg?, color?, bold?, size?, hAlign?, vAlign?, wrap?, borders? }) {
  const f: any = {};
  if (opts.bg) f.backgroundColor = opts.bg;
  const tf: any = {};
  if (opts.color) tf.foregroundColor = opts.color;  // ← HERE
  if (opts.bold !== undefined) tf.bold = opts.bold;
  if (opts.size !== undefined) tf.fontSize = opts.size;
  if (Object.keys(tf).length) f.textFormat = tf;
  return f;
}
// Usage:
reqs.push({ repeatCell: { ..., cell: { userEnteredFormat: mkFmt(opts) }, fields: "userEnteredFormat" } });
```
