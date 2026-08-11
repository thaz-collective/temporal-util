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

| Import                          | Contents                                                                                       |
| ------------------------------- | ---------------------------------------------------------------------------------------------- |
| `@thaz/temporal-util`           | Environment detection helpers (`getDefaultCalendar`, `getDefaultTimeZone`, `getDefaultLocale`) |
| `@thaz/temporal-util/formatter` | `Intl.DateTimeFormat` builders for `Temporal` values                                           |
| `@thaz/temporal-util/valibot`   | Valibot schemas and actions for `Temporal` values                                              |

---

## Formatters

Builders around the ambient, Temporal-aware `Intl.DateTimeFormat`. `locale` is always required - this library doesn't
guess it for you, so pass `getDefaultLocale()` (from `@thaz/temporal-util`) or your own value. This is typically
better to build at a higher level in the rendering tree once so we don't need to calculate these options each time.

```ts
import { buildPlainDateFormatter, buildPlainTimeFormatter, buildInstantFormatter } from '@thaz/temporal-util/formatter';

const plainDateFormatter = buildPlainDateFormatter({ locale: 'en-US' });
plainDateFormatter.format(Temporal.PlainDate.from('2024-01-01'));
// -> "01/01/2024" (defaults to numeric year, 2-digit month/day)

const plainTimeFormatter = buildPlainTimeFormatter({ locale: 'en-GB' });
plainTimeFormatter.format(Temporal.PlainTime.from('08:30:00'));

const instantFormatter = buildInstantFormatter({ locale: 'en-US', timeZone: 'America/New_York' });
instantFormatter.format(Temporal.Instant.fromEpochMilliseconds(0));
```

- `buildPlainDateFormatter(options)` - date-only output (`locale` required; `year`, `month`, `day`, `calendar`
  optional, defaulting to numeric year and 2-digit month/day). Use with `Temporal.PlainDate`, `Temporal.PlainDateTime`,
  `Temporal.PlainYearMonth`, or `Temporal.PlainMonthDay`.
- `buildPlainTimeFormatter(options)` - time-only output (`locale` required; `hour`, `minute`, `second`, `calendar`
  optional, defaulting to 2-digit hour/minute/second). Use with `Temporal.PlainTime` or `Temporal.PlainDateTime`.
- `buildInstantFormatter(options)` - date, time, and time zone output (`locale` and `timeZone` required; all of the
  date/time fields above plus `timeZoneName` optional, defaulting to a short zone name) for `Temporal.Instant`.

`locale` (and `timeZone` for `buildInstantFormatter`) are the only required options - there's no automatic
environment-locale fallback, so pass `getDefaultLocale()` explicitly if you want that behavior. Every other field
falls back to `DEFAULT_DATE_FORMAT`/`DEFAULT_TIME_FORMAT`/`DEFAULT_ZONE_FORMAT`/`DEFAULT_DATE_TIME_ZONE_FORMAT`
(also exported from this entry point).

Each returns a standard `Intl.DateTimeFormat`, so any `Temporal` value it accepts can be passed to `.format()`
directly, including `Temporal.PlainYearMonth` and `Temporal.PlainMonthDay`. `Temporal.Instant` requires a formatter
built with an explicit `timeZone` (via `buildInstantFormatter`), since an instant alone doesn't carry a zone to
display in.

> [!IMPORTANT]
> `Temporal.PlainYearMonth` and `Temporal.PlainMonthDay` only format successfully when the formatter's `calendar`
> matches the value's calendar (both are `'iso8601'` unless you built the value with a different calendar). Most
> locales default to a non-`iso8601` calendar (e.g. `'gregory'` for `en-US`), so format these with an explicit
> `calendar: 'iso8601'` option, or they'll throw `RangeError: Mismatching Calendars`. `Temporal.PlainDate`,
> `Temporal.PlainDateTime`, `Temporal.PlainTime`, and `Temporal.Instant` don't have this restriction.

`Temporal.ZonedDateTime` is not accepted by `.format()` - format it with its own `.toLocaleString()` instead, reusing
a formatter's `resolvedOptions()` so the zone comes from the value itself rather than the formatter:

```ts
const zonedDateTime = Temporal.ZonedDateTime.from('2024-06-15T10:30:00-04:00[America/New_York]');
const { locale, timeZone, ...options } = instantFormatter.resolvedOptions();
zonedDateTime.toLocaleString(locale, options);
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

| Schema            | Accepts                  |
| ----------------- | ------------------------ |
| `duration()`      | `Temporal.Duration`      |
| `zonedDateTime()` | `Temporal.ZonedDateTime` |
| `instant()`       | `Temporal.Instant`       |
| `plainDateTime()` | `Temporal.PlainDateTime` |
| `plainDate()`     | `Temporal.PlainDate`     |
| `plainTime()`     | `Temporal.PlainTime`     |

---

## Valibot transformation actions

Convert other input types into a `Temporal` value, adding an issue when the conversion fails.

```ts
import * as v from 'valibot';
import * as t from '@thaz/temporal-util/valibot';

const schema = v.pipe(v.unknown(), t.toInstant('Unable to parse an Instant from this value'));

v.parse(schema, '2024-01-01T00:00:00Z'); // Temporal.Instant
```

| Action              | Converts to              | Accepts                                                                                                             |
| ------------------- | ------------------------ | ------------------------------------------------------------------------------------------------------------------- |
| `toZonedDateTime()` | `Temporal.ZonedDateTime` | `string`, `Temporal.ZonedDateTime`                                                                                  |
| `toInstant()`       | `Temporal.Instant`       | `string` (RFC 9557), `number` (epoch ms), `bigint` (epoch ns), `Date`, `Temporal.ZonedDateTime`, `Temporal.Instant` |
| `toPlainDateTime()` | `Temporal.PlainDateTime` | `string`, `Temporal.ZonedDateTime`, `Temporal.PlainDateTime`                                                        |
| `toPlainDate()`     | `Temporal.PlainDate`     | `string`, `Temporal.PlainDateTime`, `Temporal.ZonedDateTime`, `Temporal.PlainDate`                                  |
| `toPlainTime()`     | `Temporal.PlainTime`     | `string`, `Temporal.PlainDateTime`, `Temporal.ZonedDateTime`, `Temporal.PlainTime`                                  |

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
- [`temporal-polyfill`](https://www.npmjs.com/package/temporal-polyfill) - the polyfill this package targets
- [Valibot](https://valibot.dev/) - the schema library these schemas and actions extend
