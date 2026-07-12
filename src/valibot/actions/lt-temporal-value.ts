import type { BaseIssue, ErrorMessage, BaseValidation } from 'valibot';
import { _addIssue } from 'valibot';

import type { TemporalValueInput } from './types';

/**
 * Temporal less than value issue interface.
 */
export interface TemporalLTValueIssue<
  TInput extends TemporalValueInput,
  TRequirement extends TInput,
> extends BaseIssue<TInput> {
  kind: 'validation';
  type: 'temporal_lt_value';
  expected: `<${string}`;
  requirement: TRequirement;
}

/**
 * Temporal less than value action type.
 */
export interface TemporalLTValueAction<
  TInput extends TemporalValueInput,
  TRequirement extends TInput,
  TMessage extends ErrorMessage<TemporalLTValueIssue<TInput, TRequirement>> | undefined,
> extends BaseValidation<TInput, TInput, TemporalLTValueIssue<TInput, TRequirement>> {
  type: 'temporal_lt_value';
  reference: typeof temporalLTValue;
  expects: `<${string}`;
  requirement: TRequirement;
  message: TMessage;
}

/**
 * Creates a temporal less than value validation action.
 *
 * @param requirement The less than value.
 *
 * @returns A less than value action.
 */
export function temporalLTValue<TInput extends TemporalValueInput, const TRequirement extends TInput>(
  requirement: TRequirement,
): TemporalLTValueAction<TInput, TRequirement, undefined>;

/**
 * Creates a temporal less than value validation action.
 *
 * @param requirement The less than value.
 * @param message The error message.
 *
 * @returns A less than value action.
 */
export function temporalLTValue<
  TInput extends TemporalValueInput,
  const TRequirement extends TInput,
  const TMessage extends ErrorMessage<TemporalLTValueIssue<TInput, TRequirement>> | undefined,
>(requirement: TRequirement, message: TMessage): TemporalLTValueAction<TInput, TRequirement, TMessage>;

export function temporalLTValue(
  requirement: TemporalValueInput,
  message?: ErrorMessage<TemporalLTValueIssue<TemporalValueInput, TemporalValueInput>>,
): TemporalLTValueAction<
  TemporalValueInput,
  TemporalValueInput,
  ErrorMessage<TemporalLTValueIssue<TemporalValueInput, TemporalValueInput>> | undefined
> {
  return {
    kind: 'validation',
    type: 'temporal_lt_value',
    reference: temporalLTValue,
    async: false,
    expects: `<${requirement.toJSON()}`,
    requirement,
    message,
    '~run'(dataset, config) {
      const { value, typed } = dataset;

      if (typed) {
        const req = this.requirement;

        if (!(value < req)) {
          _addIssue(this, 'value', dataset, config, {
            received: dataset.value.toJSON(),
          });
        }
      }

      return dataset;
    },
  };
}
