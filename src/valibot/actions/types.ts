import type { Temporal } from '@js-temporal/polyfill';

/**
 * Union of Temporal types supported by the temporal validation and transformation actions.
 *
 * `Temporal.PlainDateTime` is intentionally excluded — it lacks timezone context, which makes
 * chronological ordering ambiguous and comparison unsafe across different locales.
 */
export type TemporalValueInput =
  | Temporal.Duration
  | Temporal.Instant
  | Temporal.PlainDateTime
  | Temporal.PlainDate
  | Temporal.PlainTime
  | Temporal.ZonedDateTime;
