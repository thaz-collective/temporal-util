import type { BaseIssue, ErrorMessage, OutputDataset, BaseTransformation } from 'valibot';
import { Temporal } from '@js-temporal/polyfill';
import { _addIssue } from 'valibot';

/**
 * Issue raised when a value cannot be converted to a {@link Temporal.Duration}.
 */
export interface ToDurationIssue<TInput> extends BaseIssue<TInput | Temporal.Duration> {
  kind: 'transformation';
  type: 'to_duration';
  expected: null;
}

/**
 * Transformation action that converts a value to a {@link Temporal.Duration}.
 */
export interface ToDurationAction<
  TInput,
  TMessage extends ErrorMessage<ToDurationIssue<TInput>> | undefined,
> extends BaseTransformation<TInput, Temporal.Duration, ToDurationIssue<TInput>> {
  type: 'to_duration';
  reference: typeof toDuration;
  message: TMessage;
}

/**
 * Options for the `toDuration` transformation action.
 *
 * For example, `{ durationType: 'hours' }` maps the number `2` to
 * `Temporal.Duration.from({ hours: 2 })`.
 */
export interface ToDurationOptions {
  durationType:
    | 'years'
    | 'months'
    | 'days'
    | 'hours'
    | 'minutes'
    | 'seconds'
    | 'milliseconds'
    | 'microseconds'
    | 'nanoseconds';
}

/**
 * Creates a transformation action that converts a value to a {@link Temporal.Duration}.
 *
 * Accepted input types and their conversions:
 * - {@link Number} — converted to the duration length with options from: {@link ToDurationOptions}.
 * - {@link Temporal.Duration} — passed through unchanged.
 *
 * @param options - Specifies which duration component ({@link ToDurationOptions}) to use when converting a number.
 *
 * @returns A `toDuration` transformation action.
 */
export function toDuration<TInput>(options: ToDurationOptions): ToDurationAction<TInput, undefined>;

/**
 * Creates a transformation action that converts a value to a {@link Temporal.Duration}.
 *
 * Accepted input types and their conversions:
 * - {@link Number} — converted to the duration length with options from: {@link ToDurationOptions}.
 * - {@link Temporal.Duration} — passed through unchanged.
 *
 * @param options - Specifies which duration component ({@link ToDurationOptions}) to use when converting a number.
 * @param message The error message used when conversion fails.
 *
 * @returns A `toDuration` transformation action.
 */
export function toDuration<TInput, const TMessage extends ErrorMessage<ToDurationIssue<TInput>> | undefined>(
  options: ToDurationOptions,
  message: TMessage,
): ToDurationAction<TInput, TMessage>;

export function toDuration(
  options: ToDurationOptions,
  message?: ErrorMessage<ToDurationIssue<unknown>>,
): ToDurationAction<unknown, ErrorMessage<ToDurationIssue<unknown>> | undefined> {
  const { durationType } = options;

  return {
    kind: 'transformation',
    type: 'to_duration',
    reference: toDuration,
    async: false,
    message,
    '~run'(dataset, config) {
      const { value } = dataset;

      try {
        if (typeof value === 'number') {
          dataset.value = Temporal.Duration.from({
            [durationType]: value,
          });
        } else if (!(value instanceof Temporal.Duration)) {
          _addIssue(this, 'duration', dataset, config, {
            received: '"Invalid conversion option"',
          });
          // @ts-expect-error We expect this here. As noted in valibot documentation this code is correct but simplifies the types
          dataset.typed = false;
        }
      } catch {
        _addIssue(this, 'duration', dataset, config);
        // @ts-expect-error We expect this here. As noted in valibot documentation this code is correct but simplifies the types
        dataset.typed = false;
      }

      // oxlint-disable-next-line typescript/no-unsafe-type-assertion
      return dataset as OutputDataset<Temporal.Duration, ToDurationIssue<unknown>>;
    },
  };
}
