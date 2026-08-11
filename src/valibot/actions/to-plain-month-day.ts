import type { BaseIssue, ErrorMessage, OutputDataset, BaseTransformation } from 'valibot';
import { _addIssue } from 'valibot';

/**
 * Issue raised when a value cannot be converted to a {@link Temporal.PlainMonthDay}.
 */
export interface ToPlainMonthDayIssue<TInput> extends BaseIssue<TInput | Temporal.PlainMonthDay> {
  kind: 'transformation';
  type: 'to_plain_month_day';
  expected: null;
}

/**
 * Transformation action that converts a value to a {@link Temporal.PlainMonthDay}.
 */
export interface ToPlainMonthDayAction<
  TInput,
  TMessage extends ErrorMessage<ToPlainMonthDayIssue<TInput>> | undefined,
> extends BaseTransformation<TInput, Temporal.PlainMonthDay, ToPlainMonthDayIssue<TInput>> {
  type: 'to_plain_month_day';
  reference: typeof toPlainMonthDay;
  message: TMessage;
}

/**
 * Creates a transformation action that converts a value to a {@link Temporal.PlainMonthDay}.
 *
 * Accepted input types and their conversions:
 * - {@link String} — parsed using RFC 9557.
 * - {@link Temporal.ZonedDateTime} — `.toPlainDate()` and `.toPlainMonthDay()` is called.
 * - {@link Temporal.PlainDateTime} — `.toPlainDate()` and `.toPlainMonthDay()` is called.
 * - {@link Temporal.PlainDate} — `.toPlainMonthDay()` is called.
 * - {@link Temporal.PlainMonthDay} — passed through unchanged.
 *
 * All other input types produce a validation issue.
 *
 * @returns A transformation action where value represents {@link Temporal.PlainMonthDay}.
 */
export function toPlainMonthDay<TInput>(): ToPlainMonthDayAction<TInput, undefined>;

/**
 * Creates a transformation action that converts a value to a {@link Temporal.PlainMonthDay}.
 *
 * Accepted input types and their conversions:
 * - {@link String} — parsed using RFC 9557.
 * - {@link Temporal.ZonedDateTime} — `.toPlainDate()` and `.toPlainMonthDay()` is called.
 * - {@link Temporal.PlainDateTime} — `.toPlainDate()` and `.toPlainMonthDay()` is called.
 * - {@link Temporal.PlainDate} — `.toPlainMonthDay()` is called.
 * - {@link Temporal.PlainMonthDay} — passed through unchanged.
 *
 * All other input types produce a validation issue.
 *
 * @param message The error message used when conversion fails.
 *
 * @returns A transformation action where value represents {@link Temporal.PlainMonthDay}.
 */
export function toPlainMonthDay<TInput, const TMessage extends ErrorMessage<ToPlainMonthDayIssue<TInput>> | undefined>(
  message: TMessage,
): ToPlainMonthDayAction<TInput, TMessage>;

export function toPlainMonthDay(
  message?: ErrorMessage<ToPlainMonthDayIssue<unknown>>,
): ToPlainMonthDayAction<unknown, ErrorMessage<ToPlainMonthDayIssue<unknown>> | undefined> {
  return {
    kind: 'transformation',
    type: 'to_plain_month_day',
    reference: toPlainMonthDay,
    async: false,
    message,
    '~run'(dataset, config) {
      const { value } = dataset;

      try {
        if (typeof value === 'string') {
          dataset.value = Temporal.PlainMonthDay.from(value);
        } else if (value instanceof Temporal.ZonedDateTime) {
          dataset.value = value.toPlainDate().toPlainMonthDay();
        } else if (value instanceof Temporal.PlainDateTime) {
          dataset.value = value.toPlainDate().toPlainMonthDay();
        } else if (value instanceof Temporal.PlainDate) {
          dataset.value = value.toPlainMonthDay();
        } else if (!(value instanceof Temporal.PlainMonthDay)) {
          _addIssue(this, 'plainMonthDay', dataset, config, {
            received: '"Invalid conversion option"',
          });
          // @ts-expect-error We expect this here. As noted in valibot documentation this code is correct but simplifies the types
          dataset.typed = false;
        }
      } catch {
        _addIssue(this, 'plainMonthDay', dataset, config);
        // @ts-expect-error We expect this here. As noted in valibot documentation this code is correct but simplifies the types
        dataset.typed = false;
      }

      // oxlint-disable-next-line typescript/no-unsafe-type-assertion
      return dataset as OutputDataset<Temporal.PlainMonthDay, ToPlainMonthDayIssue<unknown>>;
    },
  };
}
