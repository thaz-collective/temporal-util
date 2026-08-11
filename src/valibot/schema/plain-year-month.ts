import type { BaseIssue, ErrorMessage, BaseSchema } from 'valibot';
import { _getStandardProps, _addIssue } from 'valibot';

/**
 * Issue raised when the input is not a {@link Temporal.PlainYearMonth} instance.
 */
export interface PlainYearMonthIssue extends BaseIssue<unknown> {
  kind: 'schema';
  type: 'plain_year_month';
  expected: 'Temporal.PlainYearMonth';
}

/**
 * Schema that accepts only {@link Temporal.PlainYearMonth} instances.
 */
export interface PlainYearMonthSchema<
  TMessage extends ErrorMessage<PlainYearMonthIssue> | undefined,
> extends BaseSchema<Temporal.PlainYearMonth, Temporal.PlainYearMonth, PlainYearMonthIssue> {
  type: 'plain_year_month';
  reference: typeof plainYearMonth;
  expects: 'Temporal.PlainYearMonth';
  message: TMessage;
}

/**
 * Creates a schema that validates {@link Temporal.PlainYearMonth} instances. Any other value type
 * produces a {@link PlainYearMonthIssue}.
 *
 * @returns A schema representing {@link Temporal.PlainYearMonth}.
 */
export function plainYearMonth(): PlainYearMonthSchema<undefined>;

/**
 * Creates a schema that validates {@link Temporal.PlainYearMonth} instances. Any other value type
 * produces a {@link PlainYearMonthIssue}.
 *
 * @param message The error message used when validation fails.
 *
 * @returns A schema representing {@link Temporal.PlainYearMonth}.
 */
export function plainYearMonth<const TMessage extends ErrorMessage<PlainYearMonthIssue> | undefined>(
  message: TMessage,
): PlainYearMonthSchema<TMessage>;

export function plainYearMonth(
  message?: ErrorMessage<PlainYearMonthIssue>,
): PlainYearMonthSchema<ErrorMessage<PlainYearMonthIssue> | undefined> {
  return {
    kind: 'schema',
    type: 'plain_year_month',
    reference: plainYearMonth,
    expects: 'Temporal.PlainYearMonth',
    async: false,
    message,
    get '~standard'() {
      return _getStandardProps(this);
    },
    '~run'(dataset, config) {
      if (dataset.value instanceof Temporal.PlainYearMonth) {
        // @ts-expect-error We expect this here. As noted in valibot documentation this code is correct but simplifies the types
        dataset.typed = true;
      } else {
        _addIssue(this, 'type', dataset, config);
      }

      // @ts-expect-error We expect this here. As noted in valibot documentation this code is correct but simplifies the types
      // oxlint-disable-next-line typescript/no-unsafe-type-assertion typescript/no-unsafe-return
      return dataset as OutputDataset<Temporal.PlainYearMonth, PlainYearMonthIssue>;
    },
  };
}
