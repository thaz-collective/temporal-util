import type { BaseIssue, ErrorMessage, BaseValidation } from 'valibot';
import { _addIssue } from 'valibot';

import type { TemporalValueInput } from './types';

/**
 * Temporal not value issue interface.
 */
export interface TemporalNotValueIssue<
  TInput extends TemporalValueInput,
  TRequirement extends TInput,
> extends BaseIssue<TInput> {
  kind: 'validation';
  type: 'temporal_not_value';
  expected: `!${string}`;
  requirement: TRequirement;
}

/**
 * Temporal not value action type.
 */
export interface TemporalNotValueAction<
  TInput extends TemporalValueInput,
  TRequirement extends TInput,
  TMessage extends ErrorMessage<TemporalNotValueIssue<TInput, TRequirement>> | undefined,
> extends BaseValidation<TInput, TInput, TemporalNotValueIssue<TInput, TRequirement>> {
  type: 'temporal_not_value';
  reference: typeof temporalNotValue;
  expects: `!${string}`;
  requirement: TRequirement;
  message: TMessage;
}

/**
 * Creates a temporal not value validation action.
 *
 * @param requirement The not required value.
 *
 * @returns A not value action.
 */
export function temporalNotValue<TInput extends TemporalValueInput, const TRequirement extends TInput>(
  requirement: TRequirement,
): TemporalNotValueAction<TInput, TRequirement, undefined>;

/**
 * Creates a temporal not value validation action.
 *
 * @param requirement The not required value.
 * @param message The error message.
 *
 * @returns A not value action.
 */
export function temporalNotValue<
  TInput extends TemporalValueInput,
  const TRequirement extends TInput,
  const TMessage extends ErrorMessage<TemporalNotValueIssue<TInput, TRequirement>> | undefined,
>(requirement: TRequirement, message: TMessage): TemporalNotValueAction<TInput, TRequirement, TMessage>;

export function temporalNotValue(
  requirement: TemporalValueInput,
  message?: ErrorMessage<TemporalNotValueIssue<TemporalValueInput, TemporalValueInput>>,
): TemporalNotValueAction<
  TemporalValueInput,
  TemporalValueInput,
  ErrorMessage<TemporalNotValueIssue<TemporalValueInput, TemporalValueInput>> | undefined
> {
  return {
    kind: 'validation',
    type: 'temporal_not_value',
    reference: temporalNotValue,
    async: false,
    expects: `!${requirement.toJSON()}`,
    requirement,
    message,
    '~run'(dataset, config) {
      const { value, typed } = dataset;

      if (typed) {
        const req = this.requirement;

        if (value instanceof Temporal.ZonedDateTime && req instanceof Temporal.ZonedDateTime) {
          if (Temporal.ZonedDateTime.compare(value, req) === 0) {
            _addIssue(this, 'value', dataset, config, {
              received: dataset.value.toJSON(),
            });
          }
        } else if (value instanceof Temporal.Instant && req instanceof Temporal.Instant) {
          if (Temporal.Instant.compare(value, req) === 0) {
            _addIssue(this, 'value', dataset, config, {
              received: dataset.value.toJSON(),
            });
          }
        } else if (value instanceof Temporal.PlainDateTime && req instanceof Temporal.PlainDateTime) {
          if (Temporal.PlainDateTime.compare(value, req) === 0) {
            _addIssue(this, 'value', dataset, config, {
              received: dataset.value.toJSON(),
            });
          }
        } else if (value instanceof Temporal.PlainDate && req instanceof Temporal.PlainDate) {
          if (Temporal.PlainDate.compare(value, req) === 0) {
            _addIssue(this, 'value', dataset, config, {
              received: dataset.value.toJSON(),
            });
          }
        } else if (
          value instanceof Temporal.PlainTime &&
          req instanceof Temporal.PlainTime &&
          Temporal.PlainTime.compare(value, req) === 0
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
