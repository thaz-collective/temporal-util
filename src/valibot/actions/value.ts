import type { BaseIssue, ErrorMessage, BaseValidation } from 'valibot';
import { Temporal } from '@js-temporal/polyfill';
import { _addIssue } from 'valibot';

import type { TemporalValueInput } from './types';

/**
 * Temporal value issue interface.
 */
export interface TemporalValueIssue<
  TInput extends TemporalValueInput,
  TRequirement extends TInput,
> extends BaseIssue<TInput> {
  kind: 'validation';
  type: 'temporal_value';
  expected: `=${string}`;
  requirement: TRequirement;
}

/**
 * Temporal value action type.
 */
export interface TemporalValueAction<
  TInput extends TemporalValueInput,
  TRequirement extends TInput,
  TMessage extends ErrorMessage<TemporalValueIssue<TInput, TRequirement>> | undefined,
> extends BaseValidation<TInput, TInput, TemporalValueIssue<TInput, TRequirement>> {
  type: 'temporal_value';
  reference: typeof temporalValue;
  expects: `=${string}`;
  requirement: TRequirement;
  message: TMessage;
}

/**
 * Creates a temporal value validation action.
 *
 * @param requirement The required value.
 *
 * @returns A value action.
 */
export function temporalValue<TInput extends TemporalValueInput, const TRequirement extends TInput>(
  requirement: TRequirement,
): TemporalValueAction<TInput, TRequirement, undefined>;

/**
 * Creates a temporal value validation action.
 *
 * @param requirement The required value.
 * @param message The error message.
 *
 * @returns A value action.
 */
export function temporalValue<
  TInput extends TemporalValueInput,
  const TRequirement extends TInput,
  const TMessage extends ErrorMessage<TemporalValueIssue<TInput, TRequirement>> | undefined,
>(requirement: TRequirement, message: TMessage): TemporalValueAction<TInput, TRequirement, TMessage>;

export function temporalValue(
  requirement: TemporalValueInput,
  message?: ErrorMessage<TemporalValueIssue<TemporalValueInput, TemporalValueInput>>,
): TemporalValueAction<
  TemporalValueInput,
  TemporalValueInput,
  ErrorMessage<TemporalValueIssue<TemporalValueInput, TemporalValueInput>> | undefined
> {
  return {
    kind: 'validation',
    type: 'temporal_value',
    reference: temporalValue,
    async: false,
    expects: `=${requirement.toJSON()}`,
    requirement,
    message,
    '~run'(dataset, config) {
      const { value, typed } = dataset;

      if (typed) {
        const req = this.requirement;

        if (value instanceof Temporal.ZonedDateTime && req instanceof Temporal.ZonedDateTime) {
          if (!(Temporal.ZonedDateTime.compare(value, req) === 0)) {
            _addIssue(this, 'value', dataset, config, {
              received: dataset.value.toJSON(),
            });
          }
        } else if (value instanceof Temporal.Instant && req instanceof Temporal.Instant) {
          if (!(Temporal.Instant.compare(value, req) === 0)) {
            _addIssue(this, 'value', dataset, config, {
              received: dataset.value.toJSON(),
            });
          }
        } else if (value instanceof Temporal.PlainDateTime && req instanceof Temporal.PlainDateTime) {
          if (!(Temporal.PlainDateTime.compare(value, req) === 0)) {
            _addIssue(this, 'value', dataset, config, {
              received: dataset.value.toJSON(),
            });
          }
        } else if (value instanceof Temporal.PlainDate && req instanceof Temporal.PlainDate) {
          if (!(Temporal.PlainDate.compare(value, req) === 0)) {
            _addIssue(this, 'value', dataset, config, {
              received: dataset.value.toJSON(),
            });
          }
        } else if (
          value instanceof Temporal.PlainTime &&
          req instanceof Temporal.PlainTime &&
          !(Temporal.PlainTime.compare(value, req) === 0)
        ) {
          _addIssue(this, 'value', dataset, config, {
            received: dataset.value.toJSON(),
          });
        }
      }

      return dataset;
    },
  };
}
