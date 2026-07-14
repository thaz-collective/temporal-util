# [@thaz/temporal-util](https://github.com/thaz-collective/temporal-util)

Temporal utilities for applications and libraries in the thaz-collective namespace. Provides `Intl` formatter
and a set of [Valibot](https://valibot.dev/) schemas and actions for validating, comparing, and transforming
[`Temporal`](https://tc39.es/proposal-temporal/docs/) values (via the [`@js-temporal/polyfill`](https://www.npmjs.com/package/@js-temporal/polyfill)).

---

## Installation

```bash
vp add @thaz/temporal-util @js-temporal/polyfill valibot
```

---

## Entry points

| Import                          | Contents                                                                                       |
|---------------------------------|------------------------------------------------------------------------------------------------|
| `@thaz/temporal-util`           | Environment detection helpers (`getDefaultCalendar`, `getDefaultTimeZone`, `getDefaultLocale`) |
| `@thaz/temporal-util/formatter` | `Intl.DateTimeFormat` builders for `Temporal` values                                           |
| `@thaz/temporal-util/valibot`   | Valibot schemas and actions for `Temporal` values                                              |

---

## Formatters

Builders around `@js-temporal/polyfill`'s `Intl.DateTimeFormat`, defaulting to the environment's calendar, time zone,
and locale so callers don't have to look them up manually. This is typically better to build at a higher level in the 
rendering tree once so we don't need to calculate these options each time.

```ts
import { buildPlainDateFormatter, buildPlainTimeFormatter, buildInstantFormatter } from '@thaz/temporal-util/formatter';
import { Temporal } from '@js-temporal/polyfill';

const plainDateFormatter = buildPlainDateFormatter();
plainDateFormatterformat(Temporal.PlainDate.from('2024-01-01'));
// -> "01/01/2024" (locale/format dependent)

const plainTimeFormatter = buildPlainTimeFormatter({ locale: 'en-GB' });
plainTimeFormatter(Temporal.PlainTime.from('08:30:00'));

const instantFormatter = buildInstantFormatter({ timeZone: 'America/New_York' });
plainTimeFormatter(Temporal.Instant.fromEpochMilliseconds(0));
```

- `buildPlainDateFormatter(options?)` - date-only output. Use with `Temporal.PlainDate` or `Temporal.PlainDateTime`.
- `buildPlainTimeFormatter(options?)` - time-only output. Use with `Temporal.PlainTime` or `Temporal.PlainDateTime`.
- `buildInstantFormatter(options)` - date, time, and time zone output for `Temporal.Instant` (`timeZone` is required).

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
|-------------------|--------------------------|
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
|---------------------|--------------------------|---------------------------------------------------------------------------------------------------------------------|
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
import { Temporal } from '@js-temporal/polyfill';
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
|------------------------------------|-------------------------------------------------|
| `temporalValue(requirement)`       | value equals `requirement`                      |
| `temporalNotValue(requirement)`    | value does not equal `requirement`              |
| `temporalGTValue(requirement)`     | value is greater than `requirement`             |
| `temporalLTValue(requirement)`     | value is less than `requirement`                |
| `temporalMinValue(requirement)`    | value is greater than or equal to `requirement` |
| `temporalMaxValue(requirement)`    | value is less than or equal to `requirement`    |
| `temporalValues(requirement[])`    | value equals any element of `requirement`       |
| `temporalNotValues(requirement[])` | value equals no element of `requirement`        |

---

## Valibot transformation actions

TODO

```ts
import * as v from 'valibot';
import { Temporal } from '@js-temporal/polyfill';
import * as t from '@thaz/temporal-util/valibot';

//TODO
```

| Action                            | Clamps when...                     |
|-----------------------------------|------------------------------------|
| `temporalToMinValue(requirement)` | value equals `requirement`         |
| `temporalToMaxValue(requirement)` | value does not equal `requirement` |

---

## References

- [Temporal proposal](https://tc39.es/proposal-temporal/docs/) - the `Temporal` API these utilities are built around
- [`@js-temporal/polyfill`](https://www.npmjs.com/package/@js-temporal/polyfill) - the polyfill this package targets
- [Valibot](https://valibot.dev/) - the schema library these schemas and actions extend
