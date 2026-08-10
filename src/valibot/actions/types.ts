/**
 * Union of Temporal types supported by the temporal validation and transformation actions.
 */
export type TemporalValueInput =
  | Temporal.ZonedDateTime
  | Temporal.Instant
  | Temporal.PlainDateTime
  | Temporal.PlainDate
  | Temporal.PlainTime;
