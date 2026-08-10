import type { BaseIssue, ErrorMessage, BaseValidation } from 'valibot';
import { _addIssue } from 'valibot';

import type { TemporalValueInput } from './types';

/**
 * Temporal max value issue interface.
 */
export interface TemporalMaxValueIssue<
  TInput extends TemporalValueInput,
  TRequirement extends TInput,
> extends BaseIssue<TInput> {
  kind: 'validation';
  type: 'temporal_max_value';
  expected: `<=${string}`;
  requirement: TRequirement;
}

/**
 * Temporal max value action type.
 */
export interface TemporalMaxValueAction<
  TInput extends TemporalValueInput,
  TRequirement extends TInput,
  TMessage extends ErrorMessage<TemporalMaxValueIssue<TInput, TRequirement>> | undefined,
> extends BaseValidation<TInput, TInput, TemporalMaxValueIssue<TInput, TRequirement>> {
  type: 'temporal_max_value';
  reference: typeof temporalMaxValue;
  expects: `<=${string}`;
  requirement: TRequirement;
  message: TMessage;
}

/**
 * Creates a temporal max value validation action.
 *
 * @param requirement The maximum value.
 *
 * @returns A max value action.
 */
export function temporalMaxValue<TInput extends TemporalValueInput, const TRequirement extends TInput>(
  requirement: TRequirement,
): TemporalMaxValueAction<TInput, TRequirement, undefined>;

/**
 * Creates a temporal max value validation action.
 *
 * @param requirement The maximum value.
 * @param message The error message.
 *
 * @returns A max value action.
 */
export function temporalMaxValue<
  TInput extends TemporalValueInput,
  const TRequirement extends TInput,
  const TMessage extends ErrorMessage<TemporalMaxValueIssue<TInput, TRequirement>>,
>(requirement: TRequirement, message: TMessage): TemporalMaxValueAction<TInput, TRequirement, TMessage>;

export function temporalMaxValue(
  requirement: TemporalValueInput,
  message?: ErrorMessage<TemporalMaxValueIssue<TemporalValueInput, TemporalValueInput>>,
): TemporalMaxValueAction<
  TemporalValueInput,
  TemporalValueInput,
  ErrorMessage<TemporalMaxValueIssue<TemporalValueInput, TemporalValueInput>> | undefined
> {
  return {
    kind: 'validation',
    type: 'temporal_max_value',
    reference: temporalMaxValue,
    async: false,
    expects: `<=${requirement.toJSON()}`,
    requirement,
    message,
    '~run'(dataset, config) {
      const { value, typed } = dataset;

      if (typed) {
        const req = this.requirement;

        if (value instanceof Temporal.ZonedDateTime && req instanceof Temporal.ZonedDateTime) {
          if (!(Temporal.ZonedDateTime.compare(value, req) <= 0)) {
            _addIssue(this, 'value', dataset, config, {
              received: dataset.value.toJSON(),
            });
          }
        } else if (value instanceof Temporal.Instant && req instanceof Temporal.Instant) {
          if (!(Temporal.Instant.compare(value, req) <= 0)) {
            _addIssue(this, 'value', dataset, config, {
              received: dataset.value.toJSON(),
            });
          }
        } else if (value instanceof Temporal.PlainDateTime && req instanceof Temporal.PlainDateTime) {
          if (!(Temporal.PlainDateTime.compare(value, req) <= 0)) {
            _addIssue(this, 'value', dataset, config, {
              received: dataset.value.toJSON(),
            });
          }
        } else if (value instanceof Temporal.PlainDate && req instanceof Temporal.PlainDate) {
          if (!(Temporal.PlainDate.compare(value, req) <= 0)) {
            _addIssue(this, 'value', dataset, config, {
              received: dataset.value.toJSON(),
            });
          }
        } else if (
          value instanceof Temporal.PlainTime &&
          req instanceof Temporal.PlainTime &&
          !(Temporal.PlainTime.compare(value, req) <= 0)
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
