import type { BaseIssue, ErrorMessage, BaseValidation } from 'valibot';
import { Temporal } from '@js-temporal/polyfill';
import { _addIssue } from 'valibot';

import type { TemporalValueInput } from './types';

/**
 * Temporal greater than value issue interface.
 */
export interface TemporalGTValueIssue<
  TInput extends TemporalValueInput,
  TRequirement extends TInput,
> extends BaseIssue<TInput> {
  kind: 'validation';
  type: 'temporal_gt_value';
  expected: `>${string}`;
  requirement: TRequirement;
}

/**
 * Temporal greater than value action type.
 */
export interface TemporalGTValueAction<
  TInput extends TemporalValueInput,
  TRequirement extends TInput,
  TMessage extends ErrorMessage<TemporalGTValueIssue<TInput, TRequirement>> | undefined,
> extends BaseValidation<TInput, TInput, TemporalGTValueIssue<TInput, TRequirement>> {
  type: 'temporal_gt_value';
  reference: typeof temporalGTValue;
  expects: `>${string}`;
  requirement: TRequirement;
  message: TMessage;
}

/**
 * Creates a temporal greater than value validation action.
 *
 * @param requirement The greater than value.
 *
 * @returns A greater than value action.
 */
export function temporalGTValue<TInput extends TemporalValueInput, const TRequirement extends TInput>(
  requirement: TRequirement,
): TemporalGTValueAction<TInput, TRequirement, undefined>;

/**
 * Creates a temporal greater than value validation action.
 *
 * @param requirement The greater than value.
 * @param message The error message.
 *
 * @returns A greater than value action.
 */
export function temporalGTValue<
  TInput extends TemporalValueInput,
  const TRequirement extends TInput,
  const TMessage extends ErrorMessage<TemporalGTValueIssue<TInput, TRequirement>> | undefined,
>(requirement: TRequirement, message: TMessage): TemporalGTValueAction<TInput, TRequirement, TMessage>;

export function temporalGTValue(
  requirement: TemporalValueInput,
  message?: ErrorMessage<TemporalGTValueIssue<TemporalValueInput, TemporalValueInput>>,
): TemporalGTValueAction<
  TemporalValueInput,
  TemporalValueInput,
  ErrorMessage<TemporalGTValueIssue<TemporalValueInput, TemporalValueInput>> | undefined
> {
  return {
    kind: 'validation',
    type: 'temporal_gt_value',
    reference: temporalGTValue,
    async: false,
    expects: `>${requirement.toJSON()}`,
    requirement,
    message,
    '~run'(dataset, config) {
      const { value, typed } = dataset;

      if (typed) {
        const req = this.requirement;

        if (value instanceof Temporal.ZonedDateTime && req instanceof Temporal.ZonedDateTime) {
          if (!(Temporal.ZonedDateTime.compare(value, req) > 0)) {
            _addIssue(this, 'value', dataset, config, {
              received: dataset.value.toJSON(),
            });
          }
        } else if (value instanceof Temporal.Instant && req instanceof Temporal.Instant) {
          if (!(Temporal.Instant.compare(value, req) > 0)) {
            _addIssue(this, 'value', dataset, config, {
              received: dataset.value.toJSON(),
            });
          }
        } else if (value instanceof Temporal.PlainDateTime && req instanceof Temporal.PlainDateTime) {
          if (!(Temporal.PlainDateTime.compare(value, req) > 0)) {
            _addIssue(this, 'value', dataset, config, {
              received: dataset.value.toJSON(),
            });
          }
        } else if (value instanceof Temporal.PlainDate && req instanceof Temporal.PlainDate) {
          if (!(Temporal.PlainDate.compare(value, req) > 0)) {
            _addIssue(this, 'value', dataset, config, {
              received: dataset.value.toJSON(),
            });
          }
        } else if (
          value instanceof Temporal.PlainTime &&
          req instanceof Temporal.PlainTime &&
          !(Temporal.PlainTime.compare(value, req) > 0)
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
