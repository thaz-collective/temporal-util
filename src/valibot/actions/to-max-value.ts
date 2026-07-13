import type { BaseTransformation } from 'valibot';
import { Temporal } from '@js-temporal/polyfill';

import type { TemporalValueInput } from './types';

/**
 * Temporal to max value action type.
 */
export interface TemporalToMaxValueAction<
  TInput extends TemporalValueInput,
  TRequirement extends TInput,
> extends BaseTransformation<TInput, TInput, never> {
  type: 'temporal_to_max_value';
  reference: typeof temporalToMaxValue;
  requirement: TRequirement;
}

/**
 * Creates a temporal to max value transformation action.
 *
 * @param requirement The maximum value.
 *
 * @returns A to max value action.
 */
export function temporalToMaxValue<TInput extends TemporalValueInput, const TRequirement extends TInput>(
  requirement: TRequirement,
): TemporalToMaxValueAction<TInput, TRequirement> {
  return {
    kind: 'transformation',
    type: 'temporal_to_max_value',
    reference: temporalToMaxValue,
    async: false,
    requirement,
    '~run'(dataset) {
      const { value } = dataset;
      const req = this.requirement;

      if (value instanceof Temporal.ZonedDateTime && req instanceof Temporal.ZonedDateTime) {
        if (Temporal.ZonedDateTime.compare(value, req) > 0) {
          dataset.value = req;
        }
      } else if (value instanceof Temporal.Instant && req instanceof Temporal.Instant) {
        if (Temporal.Instant.compare(value, req) > 0) {
          dataset.value = req;
        }
      } else if (value instanceof Temporal.PlainDateTime && req instanceof Temporal.PlainDateTime) {
        if (Temporal.PlainDateTime.compare(value, req) > 0) {
          dataset.value = req;
        }
      } else if (value instanceof Temporal.PlainDate && req instanceof Temporal.PlainDate) {
        if (Temporal.PlainDate.compare(value, req) > 0) {
          dataset.value = req;
        }
      } else if (
        value instanceof Temporal.PlainTime &&
        req instanceof Temporal.PlainTime &&
        Temporal.PlainTime.compare(value, req) > 0
      ) {
        dataset.value = req;
      }

      return dataset;
    },
  };
}
