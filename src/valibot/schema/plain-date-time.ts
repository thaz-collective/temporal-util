import { Temporal } from '@js-temporal/polyfill';
import * as v from 'valibot';

/**
 * Issue raised when the input is not a {@link Temporal.PlainDateTime} instance.
 */
export interface PlainDateTimeIssue extends v.BaseIssue<unknown> {
  kind: 'schema';
  type: 'plain_date_time';
  expected: 'Temporal.PlainDateTime';
}

/**
 * Schema that accepts only {@link Temporal.PlainDateTime} instances.
 */
export interface PlainDateTimeSchema<
  TMessage extends v.ErrorMessage<PlainDateTimeIssue> | undefined,
> extends v.BaseSchema<Temporal.PlainDateTime, Temporal.PlainDateTime, PlainDateTimeIssue> {
  type: 'plain_date_time';
  reference: typeof plainDateTime;
  expects: 'Temporal.PlainDateTime';
  message: TMessage;
}

/**
 * Creates a schema that validates {@link Temporal.PlainDateTime} instances. Any other value type
 * produces a {@link PlainDateTimeIssue}.
 *
 * @returns A schema representing {@link Temporal.PlainDateTime}.
 */
export function plainDateTime(): PlainDateTimeSchema<undefined>;

/**
 * Creates a schema that validates {@link Temporal.PlainDateTime} instances. Any other value type
 * produces a {@link PlainDateTimeIssue}.
 *
 * @param message The error message used when validation fails.
 *
 * @returns A schema representing {@link Temporal.PlainDateTime}.
 */
export function plainDateTime<const TMessage extends v.ErrorMessage<PlainDateTimeIssue> | undefined>(
  message: TMessage,
): PlainDateTimeSchema<TMessage>;

export function plainDateTime(
  message?: v.ErrorMessage<PlainDateTimeIssue>,
): PlainDateTimeSchema<v.ErrorMessage<PlainDateTimeIssue> | undefined> {
  return {
    kind: 'schema',
    type: 'plain_date_time',
    reference: plainDateTime,
    expects: 'Temporal.PlainDateTime',
    async: false,
    message,
    get '~standard'() {
      return v._getStandardProps(this);
    },
    '~run'(dataset, config) {
      if (dataset.value instanceof Temporal.PlainDateTime) {
        // @ts-expect-error We expect this here. As noted in valibot documentation this code is correct but simplifies the types
        dataset.typed = true;
      } else {
        v._addIssue(this, 'type', dataset, config);
      }

      // @ts-expect-error We expect this here. As noted in valibot documentation this code is correct but simplifies the types
      // oxlint-disable-next-line typescript/no-unsafe-type-assertion
      return dataset as v.OutputDataset<Temporal.PlainDateTime, PlainDateTimeIssue>;
    },
  };
}
