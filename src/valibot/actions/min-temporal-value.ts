import type { BaseIssue, ErrorMessage, BaseValidation } from 'valibot';
import { _addIssue } from 'valibot';

import type { TemporalValueInput } from './types';
import {Temporal} from "@js-temporal/polyfill";

/**
 * Temporal min value issue interface.
 */
export interface TemporalMinValueIssue<
  TInput extends TemporalValueInput,
  TRequirement extends TInput,
> extends BaseIssue<TInput> {
  kind: 'validation';
  type: 'temporal_min_value';
  expected: `>=${string}`;
  requirement: TRequirement;
}

/**
 * Temporal min value action type.
 */
export interface TemporalMinValueAction<
  TInput extends TemporalValueInput,
  TRequirement extends TInput,
  TMessage extends ErrorMessage<TemporalMinValueIssue<TInput, TRequirement>> | undefined,
> extends BaseValidation<TInput, TInput, TemporalMinValueIssue<TInput, TRequirement>> {
  type: 'temporal_min_value';
  reference: typeof temporalMinValue;
  expects: `>=${string}`;
  requirement: TRequirement;
  message: TMessage;
}

/**
 * Creates a temporal min value validation action.
 *
 * @param requirement The minimum value.
 *
 * @returns A min value action.
 */
export function temporalMinValue<TInput extends TemporalValueInput, const TRequirement extends TInput>(
  requirement: TRequirement,
): TemporalMinValueAction<TInput, TRequirement, undefined>;

/**
 * Creates a temporal min value validation action.
 *
 * @param requirement The minimum value.
 * @param message The error message.
 *
 * @returns A min value action.
 */
export function temporalMinValue<
  TInput extends TemporalValueInput,
  const TRequirement extends TInput,
  const TMessage extends ErrorMessage<TemporalMinValueIssue<TInput, TRequirement>> | undefined,
>(requirement: TRequirement, message: TMessage): TemporalMinValueAction<TInput, TRequirement, TMessage>;

export function temporalMinValue(
  requirement: TemporalValueInput,
  message?: ErrorMessage<TemporalMinValueIssue<TemporalValueInput, TemporalValueInput>>,
): TemporalMinValueAction<
  TemporalValueInput,
  TemporalValueInput,
  ErrorMessage<TemporalMinValueIssue<TemporalValueInput, TemporalValueInput>> | undefined
> {
  return {
    kind: 'validation',
    type: 'temporal_min_value',
    reference: temporalMinValue,
    async: false,
    expects: `>=${requirement.toJSON()}`,
    requirement,
    message,
    '~run'(dataset, config) {
      const { value, typed } = dataset;

      if (typed) {
        const req = this.requirement;

        if (value instanceof Temporal.Duration) {
          if (req instanceof Temporal.Duration) {
            if (!(Temporal.Duration.compare(value, req) >= 0)) {
              _addIssue(this, 'value', dataset, config, {
                received: dataset.value.toJSON(),
              });
            }
          } else {
            _addIssue(this, 'requirement', dataset, config, {
              received: dataset.value.toJSON(),
            });
          }
        } else if (value instanceof Temporal.ZonedDateTime) {
          if (req instanceof Temporal.ZonedDateTime) {
            if (!(Temporal.ZonedDateTime.compare(value, req) >= 0)) {
              _addIssue(this, 'value', dataset, config, {
                received: dataset.value.toJSON(),
              });
            }
          } else {
            _addIssue(this, 'requirement', dataset, config, {
              received: dataset.value.toJSON(),
            });
          }
        } else if (value instanceof Temporal.Instant) {
          if (req instanceof Temporal.Instant) {
            if (!(Temporal.Instant.compare(value, req) >= 0)) {
              _addIssue(this, 'value', dataset, config, {
                received: dataset.value.toJSON(),
              });
            }
          } else {
            _addIssue(this, 'requirement', dataset, config, {
              received: dataset.value.toJSON(),
            });
          }
        } else if (value instanceof Temporal.PlainDateTime) {
          if (req instanceof Temporal.PlainDateTime) {
            if (!(Temporal.PlainDateTime.compare(value, req) >= 0)) {
              _addIssue(this, 'value', dataset, config, {
                received: dataset.value.toJSON(),
              });
            }
          } else {
            _addIssue(this, 'requirement', dataset, config, {
              received: dataset.value.toJSON(),
            });
          }
        } else if (value instanceof Temporal.PlainDate) {
          if (req instanceof Temporal.PlainDate) {
            if (!(Temporal.PlainDate.compare(value, req) >= 0)) {
              _addIssue(this, 'value', dataset, config, {
                received: dataset.value.toJSON(),
              });
            }
          } else {
            _addIssue(this, 'requirement', dataset, config, {
              received: dataset.value.toJSON(),
            });
          }
        } else if (value instanceof Temporal.PlainTime) {
          if (req instanceof Temporal.PlainTime) {
            if (!(Temporal.PlainTime.compare(value, req) >= 0)) {
              _addIssue(this, 'value', dataset, config, {
                received: dataset.value.toJSON(),
              });
            }
          } else {
            _addIssue(this, 'requirement', dataset, config, {
              received: dataset.value.toJSON(),
            });
          }
        }
      }

      return dataset;
    },
  };
}
