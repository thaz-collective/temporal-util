import type { BaseIssue, ErrorMessage, OutputDataset, BaseTransformation } from 'valibot';
import { _addIssue } from 'valibot';

/**
 * Issue raised when a value cannot be converted to a {@link Temporal.PlainYearMonth}.
 */
export interface ToPlainYearMonthIssue<TInput> extends BaseIssue<TInput | Temporal.PlainYearMonth> {
  kind: 'transformation';
  type: 'to_plain_year_month';
  expected: null;
}

/**
 * Transformation action that converts a value to a {@link Temporal.PlainYearMonth}.
 */
export interface ToPlainYearMonthAction<
  TInput,
  TMessage extends ErrorMessage<ToPlainYearMonthIssue<TInput>> | undefined,
> extends BaseTransformation<TInput, Temporal.PlainYearMonth, ToPlainYearMonthIssue<TInput>> {
  type: 'to_plain_year_month';
  reference: typeof toPlainYearMonth;
  message: TMessage;
}

/**
 * Creates a transformation action that converts a value to a {@link Temporal.PlainYearMonth}.
 *
 * Accepted input types and their conversions:
 * - {@link String} — parsed using RFC 9557.
 * - {@link Temporal.ZonedDateTime} — `.toPlainDate()` and `.toPlainYearMonth()` is called.
 * - {@link Temporal.PlainDateTime} — `.toPlainDate()` and `.toPlainYearMonth()` is called.
 * - {@link Temporal.PlainDate} — `.toPlainYearMonth()` is called.
 * - {@link Temporal.PlainYearMonth} — passed through unchanged.
 *
 * All other input types produce a validation issue.
 *
 * @returns A transformation action where value represents {@link Temporal.PlainYearMonth}.
 */
export function toPlainYearMonth<TInput>(): ToPlainYearMonthAction<TInput, undefined>;

/**
 * Creates a transformation action that converts a value to a {@link Temporal.PlainYearMonth}.
 *
 * Accepted input types and their conversions:
 * - {@link String} — parsed using RFC 9557.
 * - {@link Temporal.ZonedDateTime} — `.toPlainDate()` and `.toPlainYearMonth()` is called.
 * - {@link Temporal.PlainDateTime} — `.toPlainDate()` and `.toPlainYearMonth()` is called.
 * - {@link Temporal.PlainDate} — `.toPlainYearMonth()` is called.
 * - {@link Temporal.PlainYearMonth} — passed through unchanged.
 *
 * All other input types produce a validation issue.
 *
 * @param message The error message used when conversion fails.
 *
 * @returns A transformation action where value represents {@link Temporal.PlainYearMonth}.
 */
export function toPlainYearMonth<
  TInput,
  const TMessage extends ErrorMessage<ToPlainYearMonthIssue<TInput>> | undefined,
>(message: TMessage): ToPlainYearMonthAction<TInput, TMessage>;

export function toPlainYearMonth(
  message?: ErrorMessage<ToPlainYearMonthIssue<unknown>>,
): ToPlainYearMonthAction<unknown, ErrorMessage<ToPlainYearMonthIssue<unknown>> | undefined> {
  return {
    kind: 'transformation',
    type: 'to_plain_year_month',
    reference: toPlainYearMonth,
    async: false,
    message,
    '~run'(dataset, config) {
      const { value } = dataset;

      try {
        if (typeof value === 'string') {
          dataset.value = Temporal.PlainYearMonth.from(value);
        } else if (value instanceof Temporal.ZonedDateTime) {
          dataset.value = value.toPlainDate().toPlainYearMonth();
        } else if (value instanceof Temporal.PlainDateTime) {
          dataset.value = value.toPlainDate().toPlainYearMonth();
        } else if (value instanceof Temporal.PlainDate) {
          dataset.value = value.toPlainYearMonth();
        } else if (!(value instanceof Temporal.PlainYearMonth)) {
          _addIssue(this, 'plainYearMonth', dataset, config, {
            received: '"Invalid conversion option"',
          });
          // @ts-expect-error We expect this here. As noted in valibot documentation this code is correct but simplifies the types
          dataset.typed = false;
        }
      } catch {
        _addIssue(this, 'plainYearMonth', dataset, config);
        // @ts-expect-error We expect this here. As noted in valibot documentation this code is correct but simplifies the types
        dataset.typed = false;
      }

      // oxlint-disable-next-line typescript/no-unsafe-type-assertion
      return dataset as OutputDataset<Temporal.PlainYearMonth, ToPlainYearMonthIssue<unknown>>;
    },
  };
}
