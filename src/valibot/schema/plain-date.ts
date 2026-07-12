import { Temporal } from '@js-temporal/polyfill';
import * as v from 'valibot';

/**
 * Issue raised when the input is not a {@link Temporal.PlainDate} instance.
 */
export interface PlainDateIssue extends v.BaseIssue<unknown> {
  kind: 'schema';
  type: 'plain_date';
  expected: 'Temporal.PlainDate';
}

/**
 * Schema that accepts only {@link Temporal.PlainDate} instances.
 */
export interface PlainDateSchema<TMessage extends v.ErrorMessage<PlainDateIssue> | undefined> extends v.BaseSchema<
  Temporal.PlainDate,
  Temporal.PlainDate,
  PlainDateIssue
> {
  type: 'plain_date';
  reference: typeof plainDate;
  expects: 'Temporal.PlainDate';
  message: TMessage;
}

/**
 * Creates a schema that validates {@link Temporal.PlainDate} instances. Any other value type
 * produces a {@link PlainDateIssue}.
 *
 * @returns A schema representing {@link Temporal.PlainDate}.
 */
export function plainDate(): PlainDateSchema<undefined>;

/**
 * Creates a schema that validates {@link Temporal.PlainDate} instances. Any other value type
 * produces a {@link PlainDateIssue}.
 *
 * @param message The error message used when validation fails.
 *
 * @returns A schema representing {@link Temporal.PlainDate}.
 */
export function plainDate<const TMessage extends v.ErrorMessage<PlainDateIssue> | undefined>(
  message: TMessage,
): PlainDateSchema<TMessage>;

export function plainDate(
  message?: v.ErrorMessage<PlainDateIssue>,
): PlainDateSchema<v.ErrorMessage<PlainDateIssue> | undefined> {
  return {
    kind: 'schema',
    type: 'plain_date',
    reference: plainDate,
    expects: 'Temporal.PlainDate',
    async: false,
    message,
    get '~standard'() {
      return v._getStandardProps(this);
    },
    '~run'(dataset, config) {
      if (dataset.value instanceof Temporal.PlainDate) {
        // @ts-expect-error We expect this here. As noted in valibot documentation this code is correct but simplifies the types
        dataset.typed = true;
      } else {
        v._addIssue(this, 'type', dataset, config);
      }

      // @ts-expect-error We expect this here. As noted in valibot documentation this code is correct but simplifies the types
      // oxlint-disable-next-line typescript/no-unsafe-type-assertion
      return dataset as v.OutputDataset<Temporal.PlainDate, PlainDateIssue>;
    },
  };
}
