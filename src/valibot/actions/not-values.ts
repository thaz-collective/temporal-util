import type { BaseIssue, ErrorMessage, BaseValidation } from 'valibot';
import { Temporal } from '@js-temporal/polyfill';
import { _addIssue } from 'valibot';

import type { TemporalValueInput } from './types';

/**
 * Temporal not values issue interface.
 */
export interface TemporalNotValuesIssue<
  TInput extends TemporalValueInput,
  TRequirement extends readonly TInput[],
> extends BaseIssue<TInput> {
  kind: 'validation';
  type: 'temporal_not_values';
  expected: `!${string}`;
  requirement: TRequirement;
}

/**
 * Temporal not values action type.
 */
export interface TemporalNotValuesAction<
  TInput extends TemporalValueInput,
  TRequirement extends readonly TInput[],
  TMessage extends ErrorMessage<TemporalNotValuesIssue<TInput, TRequirement>> | undefined,
> extends BaseValidation<TInput, TInput, TemporalNotValuesIssue<TInput, TRequirement>> {
  type: 'temporal_not_values';
  reference: typeof temporalNotValues;
  expects: `!${string}`;
  requirement: TRequirement;
  message: TMessage;
}

/**
 * Creates a temporal not values validation action.
 *
 * @param requirement The not required values.
 *
 * @returns A not values action.
 */
export function temporalNotValues<TInput extends TemporalValueInput, const TRequirement extends readonly TInput[]>(
  requirement: TRequirement,
): TemporalNotValuesAction<TInput, TRequirement, undefined>;

/**
 * Creates a temporal not values validation action.
 *
 * @param requirement The not required values.
 * @param message The error message.
 *
 * @returns A not values action.
 */
export function temporalNotValues<
  TInput extends TemporalValueInput,
  const TRequirement extends readonly TInput[],
  const TMessage extends ErrorMessage<TemporalNotValuesIssue<TInput, TRequirement>> | undefined,
>(requirement: TRequirement, message: TMessage): TemporalNotValuesAction<TInput, TRequirement, TMessage>;

export function temporalNotValues(
  requirement: readonly TemporalValueInput[],
  message?: ErrorMessage<TemporalNotValuesIssue<TemporalValueInput, readonly TemporalValueInput[]>>,
): TemporalNotValuesAction<
  TemporalValueInput,
  readonly TemporalValueInput[],
  ErrorMessage<TemporalNotValuesIssue<TemporalValueInput, readonly TemporalValueInput[]>> | undefined
> {
  return {
    kind: 'validation',
    type: 'temporal_not_values',
    reference: temporalNotValues,
    async: false,
    expects: `!${requirement.map((req) => req.toJSON()).join(' | ')}`,
    requirement,
    message,
    '~run'(dataset, config) {
      const { value, typed } = dataset;

      if (typed) {
        const isExcluded = this.requirement.some((req) => {
          if (value instanceof Temporal.ZonedDateTime && req instanceof Temporal.ZonedDateTime) {
            return Temporal.ZonedDateTime.compare(value, req) === 0;
          }
          if (value instanceof Temporal.Instant && req instanceof Temporal.Instant) {
            return Temporal.Instant.compare(value, req) === 0;
          }
          if (value instanceof Temporal.PlainDateTime && req instanceof Temporal.PlainDateTime) {
            return Temporal.PlainDateTime.compare(value, req) === 0;
          }
          if (value instanceof Temporal.PlainDate && req instanceof Temporal.PlainDate) {
            return Temporal.PlainDate.compare(value, req) === 0;
          }

          return (
            value instanceof Temporal.PlainTime &&
            req instanceof Temporal.PlainTime &&
            Temporal.PlainTime.compare(value, req) === 0
          );
        });

        if (isExcluded) {
          _addIssue(this, 'value', dataset, config, {
            received: dataset.value.toJSON(),
          });
        }
      }

      return dataset;
    },
  };
}
