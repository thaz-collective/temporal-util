import { Temporal } from '@js-temporal/polyfill';

import type { TemporalValueInput } from './types';

export function isSameTemporalType(a: TemporalValueInput, b: TemporalValueInput): boolean {
  return (
    (a instanceof Temporal.ZonedDateTime && b instanceof Temporal.ZonedDateTime) ||
    (a instanceof Temporal.Instant && b instanceof Temporal.Instant) ||
    (a instanceof Temporal.PlainDateTime && b instanceof Temporal.PlainDateTime) ||
    (a instanceof Temporal.PlainDate && b instanceof Temporal.PlainDate) ||
    (a instanceof Temporal.PlainTime && b instanceof Temporal.PlainTime)
  );
}
