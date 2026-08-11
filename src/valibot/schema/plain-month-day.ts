import type { BaseIssue, ErrorMessage, BaseSchema } from 'valibot';
import { _getStandardProps, _addIssue } from 'valibot';

/**
 * Issue raised when the input is not a {@link Temporal.PlainMonthDay} instance.
 */
export interface PlainMonthDayIssue extends BaseIssue<unknown> {
  kind: 'schema';
  type: 'plain_month_day';
  expected: 'Temporal.PlainMonthDay';
}

/**
 * Schema that accepts only {@link Temporal.PlainMonthDay} instances.
 */
export interface PlainMonthDaySchema<TMessage extends ErrorMessage<PlainMonthDayIssue> | undefined> extends BaseSchema<
  Temporal.PlainMonthDay,
  Temporal.PlainMonthDay,
  PlainMonthDayIssue
> {
  type: 'plain_month_day';
  reference: typeof plainMonthDay;
  expects: 'Temporal.PlainMonthDay';
  message: TMessage;
}

/**
 * Creates a schema that validates {@link Temporal.PlainMonthDay} instances. Any other value type
 * produces a {@link PlainMonthDayIssue}.
 *
 * @returns A schema representing {@link Temporal.PlainMonthDay}.
 */
export function plainMonthDay(): PlainMonthDaySchema<undefined>;

/**
 * Creates a schema that validates {@link Temporal.PlainMonthDay} instances. Any other value type
 * produces a {@link PlainMonthDayIssue}.
 *
 * @param message The error message used when validation fails.
 *
 * @returns A schema representing {@link Temporal.PlainMonthDay}.
 */
export function plainMonthDay<const TMessage extends ErrorMessage<PlainMonthDayIssue> | undefined>(
  message: TMessage,
): PlainMonthDaySchema<TMessage>;

export function plainMonthDay(
  message?: ErrorMessage<PlainMonthDayIssue>,
): PlainMonthDaySchema<ErrorMessage<PlainMonthDayIssue> | undefined> {
  return {
    kind: 'schema',
    type: 'plain_month_day',
    reference: plainMonthDay,
    expects: 'Temporal.PlainMonthDay',
    async: false,
    message,
    get '~standard'() {
      return _getStandardProps(this);
    },
    '~run'(dataset, config) {
      if (dataset.value instanceof Temporal.PlainMonthDay) {
        // @ts-expect-error We expect this here. As noted in valibot documentation this code is correct but simplifies the types
        dataset.typed = true;
      } else {
        _addIssue(this, 'type', dataset, config);
      }

      // @ts-expect-error We expect this here. As noted in valibot documentation this code is correct but simplifies the types
      // oxlint-disable-next-line typescript/no-unsafe-type-assertion typescript/no-unsafe-return
      return dataset as OutputDataset<Temporal.PlainMonthDay, PlainMonthDayIssue>;
    },
  };
}
