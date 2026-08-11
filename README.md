# [@thaz/temporal-util](https://github.com/thaz-collective/temporal-util)

Temporal utilities for applications and libraries in the thaz-collective namespace. Provides a preferred `Intl` formatter
configuration and a set of [Valibot](https://valibot.dev/) schemas and actions for validating, comparing, and transforming
[`Temporal`](https://tc39.es/proposal-temporal/docs/) values (assumes a global `Temporal`, e.g. via
[`temporal-polyfill`](https://www.npmjs.com/package/temporal-polyfill)).

---

## Installation

```bash
vp add @thaz/temporal-util temporal-polyfill valibot
```

---

## Requirements

This library assumes a global `Temporal` (and Temporal-aware `Intl`) is already available at runtime — it does not
bundle or import a Temporal polyfill itself. In your application's entry point, before any code from this package
runs:

```ts
import 'temporal-polyfill/full/global';
```

And in your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "lib": ["esnext.temporal", "esnext.intl", "esnext.date"]
  }
}
```

If your runtime ships native `Temporal` support, `temporal-polyfill` will detect and prefer it automatically — the
import above is still required to guarantee the ambient global is installed one way or the other. If you are sure `Temporal`
is in your runtime, then you do not need to install `temporal-polyfill`

---

## Entry points

| Import                        | Contents                                                                     |
| ----------------------------- | ---------------------------------------------------------------------------- |
| `@thaz/temporal-util`         | `Intl.DateTimeFormat` builders for `Temporal` values and environment helpers |
| `@thaz/temporal-util/valibot` | Valibot schemas and actions for `Temporal` values                            |

---

## Formatters

Builders around the ambient, Temporal-aware `Intl.DateTimeFormat`.

Use this higher up the rendering tree so we only calculate it once rather than rebuilding the formatter often

```ts
import {
  buildPlainDateFormatter,
  buildPlainTimeFormatter,
  buildDateTimeZoneAwareFormatter,
  formatTemporal,
} from '@thaz/temporal-util';

const plainDateFormatter = buildPlainDateFormatter({ locale: 'en-US' });
plainDateFormatter.format(Temporal.PlainDate.from('2024-01-01'));
// OR
formatTemporal(Temporal.PlainDate.from('2024-01-01'), plainDateFormatter);

const plainTimeFormatter = buildPlainTimeFormatter({ locale: 'en-GB' });
plainTimeFormatter.format(Temporal.PlainTime.from('08:30:00'));
// OR
formatTemporal(Temporal.PlainTime.from('08:30:00'), plainTimeFormatter);

const dateTimeZoneAwareFormatter = buildDateTimeZoneAwareFormatter({ locale: 'en-US', timeZone: 'America/New_York' });
dateTimeZoneAwareFormatter.format(Temporal.Instant.fromEpochMilliseconds(0));
// OR
formatTemporal(Temporal.Instant.fromEpochMilliseconds(0), dateTimeZoneAwareFormatter);
```

---

## Valibot schemas

Type-only schemas that accept a single `Temporal` instance and issue otherwise - they don't parse strings, they just
validate that the input is already the correct `Temporal` type.

```ts
import * as v from 'valibot';
import * as t from '@thaz/temporal-util/valibot';

const schema = v.object({
  startDate: t.plainDate('startDate must be a Temporal.PlainDate'),
});
```

| Schema             | Accepts                   |
| ------------------ | ------------------------- |
| `duration()`       | `Temporal.Duration`       |
| `zonedDateTime()`  | `Temporal.ZonedDateTime`  |
| `instant()`        | `Temporal.Instant`        |
| `plainDateTime()`  | `Temporal.PlainDateTime`  |
| `plainDate()`      | `Temporal.PlainDate`      |
| `plainTime()`      | `Temporal.PlainTime`      |
| `plainYearMonth()` | `Temporal.PlainYearMonth` |
| `plainMonthDay()`  | `Temporal.PlainMonthDay`  |

---

## Valibot transformation actions

Convert other input types into a `Temporal` value, adding an issue when the conversion fails.

```ts
import * as v from 'valibot';
import * as t from '@thaz/temporal-util/valibot';

const schema = v.pipe(v.unknown(), t.toInstant('Unable to parse an Instant from this value'));

v.parse(schema, '2024-01-01T00:00:00Z'); // Temporal.Instant
```

| Action               | Converts to               | Accepts                                                                                                             |
| -------------------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `toZonedDateTime()`  | `Temporal.ZonedDateTime`  | `string`, `Temporal.ZonedDateTime`                                                                                  |
| `toInstant()`        | `Temporal.Instant`        | `string` (RFC 9557), `number` (epoch ms), `bigint` (epoch ns), `Date`, `Temporal.ZonedDateTime`, `Temporal.Instant` |
| `toPlainDateTime()`  | `Temporal.PlainDateTime`  | `string`, `Temporal.ZonedDateTime`, `Temporal.PlainDateTime`                                                        |
| `toPlainDate()`      | `Temporal.PlainDate`      | `string`, `Temporal.ZonedDateTime`, `Temporal.PlainDateTime`, `Temporal.PlainDate`                                  |
| `toPlainTime()`      | `Temporal.PlainTime`      | `string`, `Temporal.ZonedDateTime`, `Temporal.PlainDateTime`, `Temporal.PlainTime`                                  |
| `toPlainYearMonth()` | `Temporal.PlainYearMonth` | `string`, `Temporal.ZonedDateTime`, `Temporal.PlainDateTime`, `Temporal.PlainDate`, `Temporal.PlainYearMonth`       |
| `toPlainMonthDay()`  | `Temporal.PlainMonthDay`  | `string`, `Temporal.ZonedDateTime`, `Temporal.PlainDateTime`, `Temporal.PlainDate`, `Temporal.PlainMonthDay`        |

---

## Valibot validation actions

Comparison actions for the five `Temporal` value types (`ZonedDateTime`, `Instant`, `PlainDateTime`, `PlainDate`,
`PlainTime`). Each pairs the piped value against a `requirement` of the same `Temporal` type and adds an issue when the
comparison fails.

```ts
import * as v from 'valibot';
import * as t from '@thaz/temporal-util/valibot';

const schema = v.pipe(
  t.plainDate(),
  t.temporalMinValue(Temporal.PlainDate.from('2024-01-01')),
  t.temporalMaxValue(Temporal.PlainDate.from('2024-12-31')),
);

v.parse(schema, Temporal.PlainDate.from('2024-06-01')); // OK
v.parse(schema, Temporal.PlainDate.from('2023-12-31')); // throws ValiError
```

| Action                             | Passes when...                                  |
| ---------------------------------- | ----------------------------------------------- |
| `temporalValue(requirement)`       | value equals `requirement`                      |
| `temporalNotValue(requirement)`    | value does not equal `requirement`              |
| `temporalGTValue(requirement)`     | value is greater than `requirement`             |
| `temporalLTValue(requirement)`     | value is less than `requirement`                |
| `temporalMinValue(requirement)`    | value is greater than or equal to `requirement` |
| `temporalMaxValue(requirement)`    | value is less than or equal to `requirement`    |
| `temporalValues(requirement[])`    | value equals any element of `requirement`       |
| `temporalNotValues(requirement[])` | value equals no element of `requirement`        |

---

## Valibot clamp actions

Rewrite an already-typed `Temporal` value in place when it falls outside a bound, instead of raising an issue.
Unlike `temporalMinValue`/`temporalMaxValue`, these never fail validation - they silently clamp the value to
`requirement`.

```ts
import * as v from 'valibot';
import * as t from '@thaz/temporal-util/valibot';

const schema = v.pipe(
  t.plainDate(),
  t.temporalToMinValue(Temporal.PlainDate.from('2024-01-01')),
  t.temporalToMaxValue(Temporal.PlainDate.from('2024-12-31')),
);

v.parse(schema, Temporal.PlainDate.from('2023-06-01')); // -> 2024-01-01 (clamped up to the min)
v.parse(schema, Temporal.PlainDate.from('2025-06-01')); // -> 2024-12-31 (clamped down to the max)
```

| Action                            | Clamps when...                      |
| --------------------------------- | ----------------------------------- |
| `temporalToMinValue(requirement)` | value is less than `requirement`    |
| `temporalToMaxValue(requirement)` | value is greater than `requirement` |

---

## References

- [Temporal proposal](https://tc39.es/proposal-temporal/docs/) - the `Temporal` API these utilities are built around
- [`temporal-polyfill`](https://www.npmjs.com/package/temporal-polyfill) - the polyfill this package targets as a peer if you don't already have the `Temporal` API in your runtime
- [Valibot](https://valibot.dev/) - the schema library these schemas and actions extend
