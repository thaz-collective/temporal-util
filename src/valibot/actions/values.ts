import type { BaseIssue, ErrorMessage, BaseValidation } from 'valibot';
import { Temporal } from '@js-temporal/polyfill';
import { _addIssue } from 'valibot';

import type { TemporalValueInput } from './types';
import { isSameTemporalType } from './util';

/**
 * Temporal values issue interface.
 */
export interface TemporalValuesIssue<
  TInput extends TemporalValueInput,
  TRequirement extends readonly TInput[],
> extends BaseIssue<TInput> {
  kind: 'validation';
  type: 'temporal_values';
  expected: `=${string}`;
  requirement: TRequirement;
}

/**
 * Temporal values action type.
 */
export interface TemporalValuesAction<
  TInput extends TemporalValueInput,
  TRequirement extends readonly TInput[],
  TMessage extends ErrorMessage<TemporalValuesIssue<TInput, TRequirement>> | undefined,
> extends BaseValidation<TInput, TInput, TemporalValuesIssue<TInput, TRequirement>> {
  type: 'temporal_values';
  reference: typeof temporalValues;
  expects: `=${string}`;
  requirement: TRequirement;
  message: TMessage;
}

/**
 * Creates a temporal values validation action.
 *
 * @param requirement The required values.
 *
 * @returns A values action.
 */
export function temporalValues<TInput extends TemporalValueInput, const TRequirement extends readonly TInput[]>(
  requirement: TRequirement,
): TemporalValuesAction<TInput, TRequirement, undefined>;

/**
 * Creates a temporal values validation action.
 *
 * @param requirement The required values.
 * @param message The error message.
 *
 * @returns A values action.
 */
export function temporalValues<
  TInput extends TemporalValueInput,
  const TRequirement extends readonly TInput[],
  const TMessage extends ErrorMessage<TemporalValuesIssue<TInput, TRequirement>> | undefined,
>(requirement: TRequirement, message: TMessage): TemporalValuesAction<TInput, TRequirement, TMessage>;

export function temporalValues(
  requirement: readonly TemporalValueInput[],
  message?: ErrorMessage<TemporalValuesIssue<TemporalValueInput, readonly TemporalValueInput[]>>,
): TemporalValuesAction<
  TemporalValueInput,
  readonly TemporalValueInput[],
  ErrorMessage<TemporalValuesIssue<TemporalValueInput, readonly TemporalValueInput[]>> | undefined
> {
  return {
    kind: 'validation',
    type: 'temporal_values',
    reference: temporalValues,
    async: false,
    expects: `=${requirement.map((req) => req.toJSON()).join(' | ')}`,
    requirement,
    message,
    '~run'(dataset, config) {
      const { value, typed } = dataset;

      if (typed) {
        const isValid = this.requirement.some((req) => {
          if (value instanceof Temporal.ZonedDateTime && req instanceof Temporal.ZonedDateTime) {
            return Temporal.ZonedDateTime.compare(value, req) === 0;
          } else if (value instanceof Temporal.Instant && req instanceof Temporal.Instant) {
            return Temporal.Instant.compare(value, req) === 0;
          } else if (value instanceof Temporal.PlainDateTime && req instanceof Temporal.PlainDateTime) {
            return Temporal.PlainDateTime.compare(value, req) === 0;
          } else if (value instanceof Temporal.PlainDate && req instanceof Temporal.PlainDate) {
            return Temporal.PlainDate.compare(value, req) === 0;
          } else if (value instanceof Temporal.PlainTime && req instanceof Temporal.PlainTime) {
            return Temporal.PlainTime.compare(value, req) === 0;
          }

          return false;
        });

        if (!isValid) {
          if (this.requirement.some((req) => isSameTemporalType(value, req))) {
            _addIssue(this, 'value', dataset, config, {
              received: dataset.value.toJSON(),
            });
          } else {
            _addIssue(this, 'requirement/value pair', dataset, config, {
              received: dataset.value.toJSON(),
            });
          }
        }
      }

      return dataset;
    },
  };
}
