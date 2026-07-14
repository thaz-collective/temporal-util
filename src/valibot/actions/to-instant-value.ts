import type { BaseIssue, ErrorMessage, OutputDataset, BaseTransformation } from 'valibot';
import { Temporal } from '@js-temporal/polyfill';
import { _addIssue } from 'valibot';

/**
 * Issue raised when a value cannot be converted to a {@link Temporal.Instant}.
 */
export interface ToInstantIssue<TInput> extends BaseIssue<TInput | Temporal.Instant> {
  kind: 'transformation';
  type: 'to_instant';
  expected: null;
}

/**
 * Transformation action that converts a value to a {@link Temporal.Instant}.
 */
export interface ToInstantAction<
  TInput,
  TMessage extends ErrorMessage<ToInstantIssue<TInput>> | undefined,
> extends BaseTransformation<TInput, Temporal.Instant, ToInstantIssue<TInput>> {
  type: 'to_instant';
  reference: typeof toInstant;
  message: TMessage;
}

/**
 * Creates a transformation action that converts a value to a {@link Temporal.Instant}.
 *
 * Accepted input types and their conversions:
 * - {@link String} — parsed using RFC 9557.
 * - {@link Number} — interpreted as epoch milliseconds.
 * - {@link BigInt} — interpreted as epoch nanoseconds.
 * - {@link Date} — converted via `Date.getTime()` (epoch milliseconds).
 * - {@link Temporal.ZonedDateTime} — `.toInstant()` is called.
 * - {@link Temporal.Instant} — passed through unchanged.
 *
 * All other input types produce a validation issue.
 *
 * @returns A transformation action where value represents {@link Temporal.Instant}.
 */
export function toInstant<TInput>(): ToInstantAction<TInput, undefined>;

/**
 * Creates a transformation action that converts a value to a {@link Temporal.Instant}.
 *
 * Accepted input types and their conversions:
 * - {@link String} — parsed using RFC 9557.
 * - {@link Number} — interpreted as epoch milliseconds.
 * - {@link BigInt} — interpreted as epoch nanoseconds.
 * - {@link Date} — converted via `Date.getTime()` (epoch milliseconds).
 * - {@link Temporal.ZonedDateTime} — `.toInstant()` is called.
 * - {@link Temporal.Instant} — passed through unchanged.
 *
 * All other input types produce a validation issue.
 *
 * @param message The error message used when conversion fails.
 *
 * @returns A transformation action where value represents {@link Temporal.Instant}.
 */
export function toInstant<TInput, const TMessage extends ErrorMessage<ToInstantIssue<TInput>> | undefined>(
  message: TMessage,
): ToInstantAction<TInput, TMessage>;

export function toInstant(
  message?: ErrorMessage<ToInstantIssue<unknown>>,
): ToInstantAction<unknown, ErrorMessage<ToInstantIssue<unknown>> | undefined> {
  return {
    kind: 'transformation',
    type: 'to_instant',
    reference: toInstant,
    async: false,
    message,
    '~run'(dataset, config) {
      const { value } = dataset;

      try {
        if (typeof value === 'string') {
          dataset.value = Temporal.Instant.from(value);
        } else if (typeof value === 'number') {
          dataset.value = Temporal.Instant.fromEpochMilliseconds(value);
        } else if (typeof value === 'bigint') {
          dataset.value = Temporal.Instant.fromEpochNanoseconds(value);
        } else if (value instanceof Date) {
          dataset.value = Temporal.Instant.fromEpochMilliseconds(value.getTime());
        } else if (value instanceof Temporal.ZonedDateTime) {
          dataset.value = value.toInstant();
        } else if (!(value instanceof Temporal.Instant)) {
          _addIssue(this, 'instant', dataset, config, {
            received: '"Invalid conversion option"',
          });
          // @ts-expect-error We expect this here. As noted in valibot documentation this code is correct but simplifies the types
          dataset.typed = false;
        }
      } catch {
        _addIssue(this, 'instant', dataset, config);
        // @ts-expect-error We expect this here. As noted in valibot documentation this code is correct but simplifies the types
        dataset.typed = false;
      }

      // oxlint-disable-next-line typescript/no-unsafe-type-assertion
      return dataset as OutputDataset<Temporal.Instant, ToInstantIssue<unknown>>;
    },
  };
}
