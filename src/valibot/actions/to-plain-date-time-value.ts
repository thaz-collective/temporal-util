import type { BaseIssue, ErrorMessage, OutputDataset, BaseTransformation } from 'valibot';
import { _addIssue } from 'valibot';

/**
 * Issue raised when a value cannot be converted to a {@link Temporal.PlainDateTime}.
 */
export interface ToPlainDateTimeIssue<TInput> extends BaseIssue<TInput | Temporal.PlainDateTime> {
  kind: 'transformation';
  type: 'to_plain_date_time';
  expected: null;
}

/**
 * Transformation action that converts a value to a {@link Temporal.PlainDateTime}.
 */
export interface ToPlainDateTimeAction<
  TInput,
  TMessage extends ErrorMessage<ToPlainDateTimeIssue<TInput>> | undefined,
> extends BaseTransformation<TInput, Temporal.PlainDateTime, ToPlainDateTimeIssue<TInput>> {
  type: 'to_plain_date_time';
  reference: typeof toPlainDateTime;
  message: TMessage;
}

/**
 * Creates a transformation action that converts a value to a {@link Temporal.PlainDateTime}.
 *
 * Accepted input types and their conversions:
 * - {@link String} — parsed using RFC 9557.
 * - {@link Temporal.ZonedDateTime} — `.toPlainDate()` is called.
 * - {@link Temporal.PlainDateTime} — passed through unchanged.
 *
 * All other input types produce a validation issue.
 *
 * @returns A transformation action where value represents {@link Temporal.PlainDateTime}.
 */
export function toPlainDateTime<TInput>(): ToPlainDateTimeAction<TInput, undefined>;

/**
 * Creates a transformation action that converts a value to a {@link Temporal.PlainDateTime}.
 *
 * Accepted input types and their conversions:
 * - {@link String} — parsed using RFC 9557.
 * - {@link Temporal.ZonedDateTime} — `.toPlainDate()` is called.
 * - {@link Temporal.PlainDateTime} — passed through unchanged.
 *
 * All other input types produce a validation issue.
 *
 * @param message The error message used when conversion fails.
 *
 * @returns A transformation action where value represents {@link Temporal.PlainDateTime}.
 */
export function toPlainDateTime<TInput, const TMessage extends ErrorMessage<ToPlainDateTimeIssue<TInput>> | undefined>(
  message: TMessage,
): ToPlainDateTimeAction<TInput, TMessage>;

export function toPlainDateTime(
  message?: ErrorMessage<ToPlainDateTimeIssue<unknown>>,
): ToPlainDateTimeAction<unknown, ErrorMessage<ToPlainDateTimeIssue<unknown>> | undefined> {
  return {
    kind: 'transformation',
    type: 'to_plain_date_time',
    reference: toPlainDateTime,
    async: false,
    message,
    '~run'(dataset, config) {
      const { value } = dataset;

      try {
        if (typeof value === 'string') {
          dataset.value = Temporal.PlainDateTime.from(value);
        } else if (value instanceof Temporal.ZonedDateTime) {
          dataset.value = value.toPlainDateTime();
        } else if (!(value instanceof Temporal.PlainDateTime)) {
          _addIssue(this, 'plainDateTime', dataset, config, {
            received: '"Invalid conversion option"',
          });
          // @ts-expect-error We expect this here. As noted in valibot documentation this code is correct but simplifies the types
          dataset.typed = false;
        }
      } catch {
        _addIssue(this, 'plainDateTime', dataset, config);
        // @ts-expect-error We expect this here. As noted in valibot documentation this code is correct but simplifies the types
        dataset.typed = false;
      }

      // oxlint-disable-next-line typescript/no-unsafe-type-assertion
      return dataset as OutputDataset<Temporal.PlainDateTime, ToPlainDateTimeIssue<unknown>>;
    },
  };
}
