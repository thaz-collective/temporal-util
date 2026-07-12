import type { BaseIssue, ErrorMessage, OutputDataset, BaseTransformation } from 'valibot';
import { Temporal } from '@js-temporal/polyfill';
import { _addIssue } from 'valibot';

/**
 * Issue raised when a value cannot be converted to a {@link Temporal.PlainDate}.
 */
export interface ToPlainDateIssue<TInput> extends BaseIssue<TInput | Temporal.PlainDate> {
  kind: 'transformation';
  type: 'to_plain_date';
  expected: null;
}

/**
 * Transformation action that converts a value to a {@link Temporal.PlainDate}.
 */
export interface ToPlainDateAction<
  TInput,
  TMessage extends ErrorMessage<ToPlainDateIssue<TInput>> | undefined,
> extends BaseTransformation<TInput, Temporal.PlainDate, ToPlainDateIssue<TInput>> {
  type: 'to_plain_date';
  reference: typeof toPlainDate;
  message: TMessage;
}

/**
 * Creates a transformation action that converts a value to a {@link Temporal.PlainDate}.
 *
 * Accepted input types and their conversions:
 * - {@link String} — parsed using RFC 9557.
 * - {@link Temporal.ZonedDateTime} — `.toPlainDate()` is called.
 * - {@link Temporal.PlainDateTime} — `.toPlainDate()` is called.
 * - {@link Temporal.PlainDate} — passed through unchanged.
 *
 * All other input types produce a validation issue.
 *
 * @returns A transformation action where value represents {@link Temporal.PlainDate}.
 */
export function toPlainDate<TInput>(): ToPlainDateAction<TInput, undefined>;

/**
 * Creates a transformation action that converts a value to a {@link Temporal.PlainDate}.
 *
 * Accepted input types and their conversions:
 * - {@link String} — parsed using RFC 9557.
 * - {@link Temporal.ZonedDateTime} — `.toPlainDate()` is called.
 * - {@link Temporal.PlainDateTime} — `.toPlainDate()` is called.
 * - {@link Temporal.PlainDate} — passed through unchanged.
 *
 * All other input types produce a validation issue.
 *
 * @param message The error message used when conversion fails.
 *
 * @returns A transformation action where value represents {@link Temporal.PlainDate}.
 */
export function toPlainDate<TInput, const TMessage extends ErrorMessage<ToPlainDateIssue<TInput>> | undefined>(
  message: TMessage,
): ToPlainDateAction<TInput, TMessage>;

export function toPlainDate(
  message?: ErrorMessage<ToPlainDateIssue<unknown>>,
): ToPlainDateAction<unknown, ErrorMessage<ToPlainDateIssue<unknown>> | undefined> {
  return {
    kind: 'transformation',
    type: 'to_plain_date',
    reference: toPlainDate,
    async: false,
    message,
    '~run'(dataset, config) {
      const { value } = dataset;

      try {
        if (typeof value === 'string') {
          dataset.value = Temporal.PlainDate.from(value);
        } else if (value instanceof Temporal.ZonedDateTime) {
          dataset.value = value.toPlainDate();
        } else if (value instanceof Temporal.PlainDateTime) {
          dataset.value = value.toPlainDate();
        } else if (!(value instanceof Temporal.PlainDate)) {
          _addIssue(this, 'plainDate', dataset, config, {
            received: '"Invalid conversion option"',
          });
          // @ts-expect-error We expect this here. As noted in valibot documentation this code is correct but simplifies the types
          dataset.typed = false;
        }
      } catch {
        _addIssue(this, 'plainDate', dataset, config);
        // @ts-expect-error We expect this here. As noted in valibot documentation this code is correct but simplifies the types
        dataset.typed = false;
      }

      // oxlint-disable-next-line typescript/no-unsafe-type-assertion
      return dataset as OutputDataset<Temporal.PlainDate, ToPlainDateIssue<unknown>>;
    },
  };
}
